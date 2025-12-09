import { z } from 'zod';

// ============================================
// SUBSCRIPTION CONFIGURATION
// ============================================

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    productLimit: 10,
    aiQuestionsPerMonth: 5,
    features: [
      'Up to 10 products',
      'Basic warranty tracking',
      'Manual search',
      '5 AI questions/month',
    ],
  },
  PLUS: {
    name: 'Plus',
    monthlyPrice: 4.99,
    yearlyPrice: 47.88,
    productLimit: 100,
    aiQuestionsPerMonth: 50,
    features: [
      'Up to 100 products',
      'Full warranty tracking',
      'Warranty registration assistant',
      'Manual download & offline',
      '50 AI questions/month',
      'Maintenance reminders',
      'Email notifications',
    ],
  },
  PRO: {
    name: 'Pro',
    monthlyPrice: 9.99,
    yearlyPrice: 95.88,
    productLimit: -1, // Unlimited
    aiQuestionsPerMonth: -1, // Unlimited
    features: [
      'Unlimited products',
      'Everything in Plus',
      'Unlimited AI questions',
      'Priority support',
      'Product health scoring',
      'Cost of ownership reports',
      'Export to accounting software',
    ],
  },
  BUSINESS: {
    name: 'Business',
    monthlyPrice: 24.99,
    yearlyPrice: 239.88,
    productLimit: -1,
    aiQuestionsPerMonth: -1,
    features: [
      'Everything in Pro',
      'Team sharing (up to 10)',
      'Business expense tagging',
      'QuickBooks integration',
      'Dedicated support',
      'Custom categories',
      'API access',
    ],
  },
} as const;

// ============================================
// PRODUCT CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = {
  APPLIANCE_MAJOR: { label: 'Major Appliances', icon: 'refrigerator', avgLifespanMonths: 120 },
  APPLIANCE_SMALL: { label: 'Small Appliances', icon: 'blender', avgLifespanMonths: 60 },
  ELECTRONICS_TV: { label: 'TVs & Displays', icon: 'tv', avgLifespanMonths: 84 },
  ELECTRONICS_AUDIO: { label: 'Audio Equipment', icon: 'speaker', avgLifespanMonths: 96 },
  ELECTRONICS_COMPUTER: { label: 'Computers', icon: 'laptop', avgLifespanMonths: 60 },
  ELECTRONICS_PHONE: { label: 'Phones & Tablets', icon: 'smartphone', avgLifespanMonths: 36 },
  ELECTRONICS_CAMERA: { label: 'Cameras', icon: 'camera', avgLifespanMonths: 72 },
  ELECTRONICS_GAMING: { label: 'Gaming', icon: 'gamepad', avgLifespanMonths: 72 },
  ELECTRONICS_OTHER: { label: 'Other Electronics', icon: 'cpu', avgLifespanMonths: 60 },
  FURNITURE: { label: 'Furniture', icon: 'armchair', avgLifespanMonths: 120 },
  OUTDOOR_POWER: { label: 'Outdoor Power Equipment', icon: 'tractor', avgLifespanMonths: 96 },
  OUTDOOR_GARDEN: { label: 'Garden & Lawn', icon: 'flower', avgLifespanMonths: 60 },
  TOOLS_POWER: { label: 'Power Tools', icon: 'drill', avgLifespanMonths: 84 },
  TOOLS_HAND: { label: 'Hand Tools', icon: 'wrench', avgLifespanMonths: 240 },
  HVAC: { label: 'HVAC', icon: 'thermometer', avgLifespanMonths: 180 },
  PLUMBING: { label: 'Plumbing', icon: 'droplet', avgLifespanMonths: 120 },
  AUTOMOTIVE: { label: 'Automotive', icon: 'car', avgLifespanMonths: 144 },
  SPORTS_FITNESS: { label: 'Sports & Fitness', icon: 'dumbbell', avgLifespanMonths: 60 },
  TOYS_GAMES: { label: 'Toys & Games', icon: 'puzzle', avgLifespanMonths: 36 },
  JEWELRY_WATCH: { label: 'Jewelry & Watches', icon: 'watch', avgLifespanMonths: 240 },
  CLOTHING_SHOES: { label: 'Clothing & Shoes', icon: 'shirt', avgLifespanMonths: 24 },
  HOME_DECOR: { label: 'Home Decor', icon: 'lamp', avgLifespanMonths: 120 },
  KITCHEN_COOKWARE: { label: 'Kitchen & Cookware', icon: 'utensils', avgLifespanMonths: 120 },
  BABY_KIDS: { label: 'Baby & Kids', icon: 'baby', avgLifespanMonths: 24 },
  PETS: { label: 'Pet Supplies', icon: 'paw', avgLifespanMonths: 36 },
  HEALTH_MEDICAL: { label: 'Health & Medical', icon: 'heart-pulse', avgLifespanMonths: 60 },
  OTHER: { label: 'Other', icon: 'box', avgLifespanMonths: 60 },
} as const;

// ============================================
// DEFAULT WARRANTY PERIODS (months)
// ============================================

export const DEFAULT_WARRANTY_PERIODS: Record<string, number> = {
  APPLIANCE_MAJOR: 12,
  APPLIANCE_SMALL: 12,
  ELECTRONICS_TV: 12,
  ELECTRONICS_AUDIO: 12,
  ELECTRONICS_COMPUTER: 12,
  ELECTRONICS_PHONE: 12,
  ELECTRONICS_CAMERA: 12,
  ELECTRONICS_GAMING: 12,
  ELECTRONICS_OTHER: 12,
  FURNITURE: 12,
  OUTDOOR_POWER: 24,
  OUTDOOR_GARDEN: 12,
  TOOLS_POWER: 36,
  TOOLS_HAND: 120, // Lifetime warranties common
  HVAC: 60,
  PLUMBING: 12,
  AUTOMOTIVE: 36,
  SPORTS_FITNESS: 12,
  TOYS_GAMES: 3,
  JEWELRY_WATCH: 24,
  CLOTHING_SHOES: 0,
  HOME_DECOR: 0,
  KITCHEN_COOKWARE: 12,
  BABY_KIDS: 6,
  PETS: 6,
  HEALTH_MEDICAL: 12,
  OTHER: 12,
};

// ============================================
// MAINTENANCE SCHEDULES
// ============================================

export interface MaintenanceScheduleItem {
  name: string;
  intervalMonths: number;
  estimatedMinutes?: number;
  estimatedCost?: number;
  description?: string;
}

export const MAINTENANCE_SCHEDULES: Record<string, MaintenanceScheduleItem[]> = {
  APPLIANCE_MAJOR: [
    { name: 'Clean refrigerator coils', intervalMonths: 12, estimatedMinutes: 30 },
    { name: 'Replace refrigerator water filter', intervalMonths: 6, estimatedCost: 30 },
    { name: 'Clean dishwasher filter', intervalMonths: 1, estimatedMinutes: 10 },
    { name: 'Clean washing machine drum', intervalMonths: 1, estimatedMinutes: 15 },
    { name: 'Clean dryer lint trap and vent', intervalMonths: 3, estimatedMinutes: 30 },
  ],
  HVAC: [
    { name: 'Replace HVAC filter', intervalMonths: 3, estimatedCost: 25 },
    { name: 'Professional HVAC service', intervalMonths: 12, estimatedCost: 150 },
    { name: 'Clean air vents', intervalMonths: 6, estimatedMinutes: 30 },
  ],
  OUTDOOR_POWER: [
    { name: 'Change oil', intervalMonths: 12, estimatedCost: 20 },
    { name: 'Replace spark plug', intervalMonths: 12, estimatedCost: 10 },
    { name: 'Replace air filter', intervalMonths: 12, estimatedCost: 15 },
    { name: 'Sharpen blades', intervalMonths: 12, estimatedCost: 30 },
  ],
  AUTOMOTIVE: [
    { name: 'Oil change', intervalMonths: 6, estimatedCost: 50 },
    { name: 'Tire rotation', intervalMonths: 6, estimatedCost: 30 },
    { name: 'Replace air filter', intervalMonths: 12, estimatedCost: 25 },
    { name: 'Brake inspection', intervalMonths: 12, estimatedCost: 50 },
  ],
};

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 min
  api: { windowMs: 60 * 1000, max: 100 }, // 100 requests per minute
  upload: { windowMs: 60 * 1000, max: 10 }, // 10 uploads per minute
};

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  allowedDocTypes: ['application/pdf'],
  maxImagesPerProduct: 5,
  thumbnailSize: { width: 200, height: 200 },
  compressedSize: { width: 1200, height: 1200 },
};

// ============================================
// OCR CONFIGURATION
// ============================================

export const OCR_CONFIG = {
  clientSideEngine: 'tesseract',
  serverSideEngine: 'google_vision',
  confidenceThreshold: 0.7,
  maxProcessingTime: 30000, // 30 seconds
  supportedLanguages: ['eng', 'spa', 'fra', 'deu'],
};

// ============================================
// AI CONFIGURATION
// ============================================

export const AI_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 500,
  temperature: 0.7,
  systemPromptTemplate: `You are a helpful product support assistant for Keeper, an app that helps users track their product warranties and access manuals.

You have access to the following context about the user's product:
- Product: {{productName}}
- Brand: {{brand}}
- Model: {{model}}
- Category: {{category}}
- Purchase Date: {{purchaseDate}}
- Warranty Status: {{warrantyStatus}}

{{#if manualContent}}
You also have access to the product manual. Use it to provide accurate information.
{{/if}}

Be helpful, concise, and specific to the user's product. If you don't know something, say so rather than making up information.`,
};

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  category: z.string(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().positive().optional(),
  purchaseLocation: z.string().max(200).optional(),
  warrantyMonths: z.number().int().min(0).max(240).optional(),
  location: z.string().max(100).optional(),
  assignedTo: z.string().max(100).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const receiptSchema = z.object({
  merchantName: z.string().max(200).optional(),
  merchantAddress: z.string().max(500).optional(),
  purchaseDate: z.coerce.date().optional(),
  totalAmount: z.number().positive().optional(),
  taxAmount: z.number().min(0).optional(),
  lineItems: z.array(z.object({
    name: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
    sku: z.string().optional(),
  })).optional(),
});

export const userPreferencesSchema = z.object({
  currency: z.string().length(3),
  timezone: z.string(),
  notifyWarranty: z.boolean(),
  notifyMaintenance: z.boolean(),
  notifyRecalls: z.boolean(),
});
