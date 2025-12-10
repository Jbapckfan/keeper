import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import { processReceiptOCR } from '../services/ocr';
import { config } from '../config';

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'receipts');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF are allowed.'));
    }
  },
});

// Apply authentication to all routes
router.use(authenticate);

// In-memory storage for dev mode (no database)
interface DevReceipt {
  id: string;
  userId: string;
  originalImageUrl: string;
  ocrStatus: string;
  ocrConfidence?: number;
  ocrRawText?: string;
  merchantName?: string;
  totalAmount?: number;
  taxAmount?: number;
  purchaseDate?: Date;
  lineItems?: any[];
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const devReceipts: Map<string, DevReceipt> = new Map();

// GET /api/receipts
router.get('/', async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));

    // Dev mode: return from memory
    let receipts = Array.from(devReceipts.values())
      .filter((r) => r.userId === req.user!.userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (status) {
      receipts = receipts.filter((r) => r.ocrStatus === status);
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      receipts = receipts.filter((r) =>
        r.merchantName?.toLowerCase().includes(searchLower)
      );
    }

    const total = receipts.length;
    const skip = (pageNum - 1) * limitNum;
    receipts = receipts.slice(skip, skip + limitNum);

    res.json({
      data: receipts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/receipts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const receipt = devReceipts.get(req.params.id);

    if (!receipt || receipt.userId !== req.user!.userId) {
      throw ApiError.notFound('Receipt not found');
    }

    res.json({ data: receipt });
  } catch (error) {
    next(error);
  }
});

// POST /api/receipts/upload
router.post('/upload', uploadRateLimiter, upload.single('receipt'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }

    const receiptId = `receipt-${Date.now()}`;
    const imagePath = req.file.path;
    const imageUrl = `/uploads/receipts/${req.file.filename}`;

    console.log(`[Upload] New receipt ${receiptId} from ${req.user!.email}`);
    console.log(`[Upload] File saved to: ${imagePath}`);

    // Create receipt record
    const receipt: DevReceipt = {
      id: receiptId,
      userId: req.user!.userId,
      originalImageUrl: imageUrl,
      ocrStatus: 'PROCESSING',
      source: 'UPLOAD',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    devReceipts.set(receiptId, receipt);

    // Return immediately, process OCR in background
    res.status(201).json({
      data: {
        receiptId,
        status: 'processing',
        message: 'Receipt uploaded successfully. OCR processing started.',
      },
    });

    // Process OCR in background (don't await)
    processReceiptOCR(imagePath)
      .then((ocrResult) => {
        console.log(`[OCR] Completed for ${receiptId}`);
        console.log(`[OCR] Merchant: ${ocrResult.merchantName}`);
        console.log(`[OCR] Total: $${ocrResult.totalAmount}`);
        console.log(`[OCR] Items found: ${ocrResult.lineItems.length}`);

        // Update receipt with OCR results
        const existingReceipt = devReceipts.get(receiptId);
        if (existingReceipt) {
          existingReceipt.ocrStatus = 'COMPLETED';
          existingReceipt.ocrConfidence = ocrResult.confidence;
          existingReceipt.ocrRawText = ocrResult.rawText;
          existingReceipt.merchantName = ocrResult.merchantName;
          existingReceipt.totalAmount = ocrResult.totalAmount;
          existingReceipt.taxAmount = ocrResult.taxAmount;
          existingReceipt.purchaseDate = ocrResult.purchaseDate;
          existingReceipt.lineItems = ocrResult.lineItems;
          existingReceipt.updatedAt = new Date();
        }
      })
      .catch((error) => {
        console.error(`[OCR] Failed for ${receiptId}:`, error);
        const existingReceipt = devReceipts.get(receiptId);
        if (existingReceipt) {
          existingReceipt.ocrStatus = 'FAILED';
          existingReceipt.updatedAt = new Date();
        }
      });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/receipts/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const updateSchema = z.object({
      merchantName: z.string().optional(),
      merchantAddress: z.string().optional(),
      purchaseDate: z.coerce.date().optional(),
      totalAmount: z.number().optional(),
      taxAmount: z.number().optional(),
      lineItems: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        totalPrice: z.number(),
        sku: z.string().optional(),
      })).optional(),
      category: z.string().optional(),
      isBusinessExpense: z.boolean().optional(),
    });

    const data = updateSchema.parse(req.body);

    const receipt = devReceipts.get(req.params.id);
    if (!receipt || receipt.userId !== req.user!.userId) {
      throw ApiError.notFound('Receipt not found');
    }

    // Update fields
    if (data.merchantName !== undefined) receipt.merchantName = data.merchantName;
    if (data.purchaseDate !== undefined) receipt.purchaseDate = data.purchaseDate;
    if (data.totalAmount !== undefined) receipt.totalAmount = data.totalAmount;
    if (data.taxAmount !== undefined) receipt.taxAmount = data.taxAmount;
    if (data.lineItems !== undefined) receipt.lineItems = data.lineItems;
    receipt.updatedAt = new Date();

    res.json({ data: receipt });
  } catch (error) {
    next(error);
  }
});

// POST /api/receipts/:id/reprocess
router.post('/:id/reprocess', async (req, res, next) => {
  try {
    const receipt = devReceipts.get(req.params.id);
    if (!receipt || receipt.userId !== req.user!.userId) {
      throw ApiError.notFound('Receipt not found');
    }

    // Get the file path from the URL
    const filename = path.basename(receipt.originalImageUrl);
    const imagePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(imagePath)) {
      throw ApiError.badRequest('Original image file not found');
    }

    receipt.ocrStatus = 'PROCESSING';
    receipt.updatedAt = new Date();

    res.json({
      data: {
        receiptId: req.params.id,
        status: 'processing',
      },
    });

    // Reprocess in background
    processReceiptOCR(imagePath)
      .then((ocrResult) => {
        receipt.ocrStatus = 'COMPLETED';
        receipt.ocrConfidence = ocrResult.confidence;
        receipt.ocrRawText = ocrResult.rawText;
        receipt.merchantName = ocrResult.merchantName;
        receipt.totalAmount = ocrResult.totalAmount;
        receipt.taxAmount = ocrResult.taxAmount;
        receipt.purchaseDate = ocrResult.purchaseDate;
        receipt.lineItems = ocrResult.lineItems;
        receipt.updatedAt = new Date();
      })
      .catch((error) => {
        console.error(`[OCR] Reprocess failed for ${req.params.id}:`, error);
        receipt.ocrStatus = 'FAILED';
        receipt.updatedAt = new Date();
      });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/receipts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const receipt = devReceipts.get(req.params.id);
    if (!receipt || receipt.userId !== req.user!.userId) {
      throw ApiError.notFound('Receipt not found');
    }

    // Delete the file
    const filename = path.basename(receipt.originalImageUrl);
    const imagePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    devReceipts.delete(req.params.id);

    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
});

// GET /api/receipts/:id/image - Serve the receipt image
router.get('/:id/image', async (req, res, next) => {
  try {
    const receipt = devReceipts.get(req.params.id);
    if (!receipt || receipt.userId !== req.user!.userId) {
      throw ApiError.notFound('Receipt not found');
    }

    const filename = path.basename(receipt.originalImageUrl);
    const imagePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(imagePath)) {
      throw ApiError.notFound('Image file not found');
    }

    res.sendFile(imagePath);
  } catch (error) {
    next(error);
  }
});

export default router;
