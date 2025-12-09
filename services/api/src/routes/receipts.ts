import { Router } from 'express';
import { z } from 'zod';
import { prisma, OCRStatus, ReceiptSource } from '@keeper/database';
import { ApiError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { uploadRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

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
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId: req.user!.userId,
    };

    if (status) {
      where.ocrStatus = status;
    }

    if (search) {
      where.merchantName = { contains: search as string, mode: 'insensitive' };
    }

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          products: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.receipt.count({ where }),
    ]);

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
    const receipt = await prisma.receipt.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      include: {
        products: true,
      },
    });

    if (!receipt) {
      throw ApiError.notFound('Receipt not found');
    }

    res.json({ data: receipt });
  } catch (error) {
    next(error);
  }
});

// POST /api/receipts/upload
router.post('/upload', uploadRateLimiter, async (req, res, next) => {
  try {
    // TODO: Handle file upload with multer
    // For now, accept imageUrl directly
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw ApiError.badRequest('Image URL required');
    }

    const receipt = await prisma.receipt.create({
      data: {
        userId: req.user!.userId,
        originalImageUrl: imageUrl,
        ocrStatus: OCRStatus.PENDING,
        source: ReceiptSource.UPLOAD,
      },
    });

    // TODO: Trigger OCR processing job

    res.status(201).json({
      data: {
        receiptId: receipt.id,
        status: 'processing',
      },
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

    // Verify receipt belongs to user
    const existing = await prisma.receipt.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Receipt not found');
    }

    const receipt = await prisma.receipt.update({
      where: { id: req.params.id },
      data: {
        merchantName: data.merchantName,
        merchantAddress: data.merchantAddress,
        purchaseDate: data.purchaseDate,
        totalAmount: data.totalAmount,
        taxAmount: data.taxAmount,
        lineItems: data.lineItems,
        isBusinessExpense: data.isBusinessExpense,
        // Only set category if it matches enum
        ...(data.category ? { category: data.category as any } : {}),
      },
    });

    res.json({ data: receipt });
  } catch (error) {
    next(error);
  }
});

// POST /api/receipts/:id/reprocess
router.post('/:id/reprocess', async (req, res, next) => {
  try {
    const { engine = 'tesseract' } = req.query;

    // Verify receipt belongs to user
    const existing = await prisma.receipt.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Receipt not found');
    }

    // Update status to processing
    await prisma.receipt.update({
      where: { id: req.params.id },
      data: {
        ocrStatus: OCRStatus.PROCESSING,
        ocrEngine: engine as string,
      },
    });

    // TODO: Trigger OCR reprocessing job

    res.json({
      data: {
        receiptId: req.params.id,
        status: 'processing',
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/receipts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    // Verify receipt belongs to user
    const existing = await prisma.receipt.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Receipt not found');
    }

    await prisma.receipt.delete({
      where: { id: req.params.id },
    });

    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
