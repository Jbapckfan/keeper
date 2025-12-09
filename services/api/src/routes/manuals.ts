import { Router } from 'express';
import { z } from 'zod';
import { prisma, ManualType, ManualSource } from '@keeper/database';
import { ApiError } from '../middleware/errorHandler';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// GET /api/manuals/search - Public endpoint
router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const {
      q,
      brand,
      type,
      limit = '20',
      offset = '0',
    } = req.query;

    if (!q) {
      throw ApiError.badRequest('Search query required');
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const offsetNum = Math.max(0, parseInt(offset as string, 10));

    const where: any = {
      OR: [
        { brand: { contains: q as string, mode: 'insensitive' } },
        { model: { contains: q as string, mode: 'insensitive' } },
        { productName: { contains: q as string, mode: 'insensitive' } },
      ],
      isVerified: true,
    };

    if (brand) {
      where.brand = { contains: brand as string, mode: 'insensitive' };
    }

    if (type) {
      where.manualType = type;
    }

    const [manuals, total] = await Promise.all([
      prisma.manual.findMany({
        where,
        select: {
          id: true,
          brand: true,
          model: true,
          productName: true,
          manualType: true,
          pageCount: true,
          language: true,
          qualityScore: true,
          downloadCount: true,
          year: true,
        },
        orderBy: [
          { qualityScore: 'desc' },
          { downloadCount: 'desc' },
        ],
        skip: offsetNum,
        take: limitNum,
      }),
      prisma.manual.count({ where }),
    ]);

    res.json({
      data: {
        results: manuals,
        total,
        hasMore: offsetNum + manuals.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/manuals/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const manual = await prisma.manual.findUnique({
      where: { id: req.params.id },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            supportUrl: true,
            supportPhone: true,
          },
        },
      },
    });

    if (!manual) {
      throw ApiError.notFound('Manual not found');
    }

    res.json({ data: manual });
  } catch (error) {
    next(error);
  }
});

// GET /api/manuals/:id/download
router.get('/:id/download', authenticate, async (req, res, next) => {
  try {
    const manual = await prisma.manual.findUnique({
      where: { id: req.params.id },
    });

    if (!manual) {
      throw ApiError.notFound('Manual not found');
    }

    // Increment download count
    await prisma.manual.update({
      where: { id: req.params.id },
      data: { downloadCount: { increment: 1 } },
    });

    // TODO: Generate signed URL for file download
    // For now, return the file URL directly
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    res.json({
      data: {
        url: manual.fileUrl,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/manuals/contribute
router.post('/contribute', authenticate, async (req, res, next) => {
  try {
    const contributeSchema = z.object({
      brand: z.string().min(1),
      model: z.string().optional(),
      productName: z.string().min(1),
      type: z.nativeEnum(ManualType),
      fileUrl: z.string().url(),
    });

    const data = contributeSchema.parse(req.body);

    // Check if manual already exists
    const existing = await prisma.manual.findFirst({
      where: {
        brand: { equals: data.brand, mode: 'insensitive' },
        model: data.model ? { equals: data.model, mode: 'insensitive' } : undefined,
        manualType: data.type,
      },
    });

    if (existing) {
      throw ApiError.conflict('This manual already exists in our database');
    }

    const manual = await prisma.manual.create({
      data: {
        brand: data.brand,
        model: data.model,
        productName: data.productName,
        manualType: data.type,
        fileUrl: data.fileUrl,
        source: ManualSource.USER_CONTRIBUTED,
        contributorId: req.user!.userId,
        isVerified: false,
      },
    });

    res.status(201).json({
      data: {
        manualId: manual.id,
        status: 'pending_review',
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/manuals/:id/helpful
router.post('/:id/helpful', authenticate, async (req, res, next) => {
  try {
    const manual = await prisma.manual.findUnique({
      where: { id: req.params.id },
    });

    if (!manual) {
      throw ApiError.notFound('Manual not found');
    }

    await prisma.manual.update({
      where: { id: req.params.id },
      data: { helpfulCount: { increment: 1 } },
    });

    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
});

export default router;
