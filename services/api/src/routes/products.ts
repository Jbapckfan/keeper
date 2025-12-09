import { Router } from 'express';
import { z } from 'zod';
import { prisma, ProductCategory, WarrantyStatus, ProductStatus } from '@keeper/database';
import { productSchema } from '@keeper/config';
import { ApiError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      warrantyStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId: req.user!.userId,
      status: ProductStatus.ACTIVE,
    };

    if (category) {
      where.category = category;
    }

    if (warrantyStatus) {
      const now = new Date();
      if (warrantyStatus === 'active') {
        where.warrantyExpires = { gt: now };
      } else if (warrantyStatus === 'expired') {
        where.warrantyExpires = { lt: now };
      } else if (warrantyStatus === 'expiring') {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        where.warrantyExpires = { gt: now, lt: thirtyDaysFromNow };
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
        { model: { contains: search as string, mode: 'insensitive' } },
        { serialNumber: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          receipt: {
            select: {
              id: true,
              merchantName: true,
              purchaseDate: true,
            },
          },
          manual: {
            select: {
              id: true,
              brand: true,
              model: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
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

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      include: {
        receipt: true,
        manual: true,
        manufacturer: true,
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
          take: 10,
        },
        smartActions: {
          where: { status: 'PENDING' },
          orderBy: { priority: 'desc' },
        },
        warrantyClaimAttempts: {
          orderBy: { createdAt: 'desc' },
        },
        extendedWarranty: true,
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);

    // Calculate warranty expiration if purchase date and warranty months provided
    let warrantyExpires: Date | undefined;
    if (data.purchaseDate && data.warrantyMonths) {
      warrantyExpires = new Date(data.purchaseDate);
      warrantyExpires.setMonth(warrantyExpires.getMonth() + data.warrantyMonths);
    }

    // Determine warranty status
    let warrantyStatus: typeof WarrantyStatus[keyof typeof WarrantyStatus] = WarrantyStatus.UNKNOWN;
    if (warrantyExpires) {
      warrantyStatus = warrantyExpires > new Date() ? WarrantyStatus.ACTIVE : WarrantyStatus.EXPIRED;
    }

    const product = await prisma.product.create({
      data: {
        userId: req.user!.userId,
        name: data.name,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        category: data.category as ProductCategory,
        purchaseDate: data.purchaseDate,
        purchasePrice: data.purchasePrice,
        purchaseLocation: data.purchaseLocation,
        warrantyMonths: data.warrantyMonths,
        warrantyExpires,
        warrantyStatus,
        location: data.location,
        assignedTo: data.assignedTo,
        notes: data.notes,
        tags: data.tags || [],
      },
    });

    // Update user's product count
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { productCount: { increment: 1 } },
    });

    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);

    // Verify product belongs to user
    const existing = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Product not found');
    }

    // Recalculate warranty expiration if needed
    let warrantyExpires = existing.warrantyExpires;
    const purchaseDate = data.purchaseDate || existing.purchaseDate;
    const warrantyMonths = data.warrantyMonths ?? existing.warrantyMonths;

    if (purchaseDate && warrantyMonths) {
      warrantyExpires = new Date(purchaseDate);
      warrantyExpires.setMonth(warrantyExpires.getMonth() + warrantyMonths);
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...data,
        category: data.category as ProductCategory | undefined,
        warrantyExpires,
        warrantyStatus: warrantyExpires
          ? warrantyExpires > new Date()
            ? WarrantyStatus.ACTIVE
            : WarrantyStatus.EXPIRED
          : WarrantyStatus.UNKNOWN,
      },
    });

    res.json({ data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    // Verify product belongs to user
    const existing = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw ApiError.notFound('Product not found');
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    // Update user's product count
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { productCount: { decrement: 1 } },
    });

    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id/health
router.get('/:id/health', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Calculate health score (simplified version)
    // TODO: Implement full health score algorithm from config
    const score = product.healthScore || 85;

    res.json({
      data: {
        score,
        factors: {
          ageScore: 90,
          maintenanceScore: 80,
          issueScore: 85,
          categoryBonus: 5,
        },
        recommendations: [
          'Product is in good condition',
          'Schedule regular maintenance to maintain health',
        ],
        trend: [],
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
