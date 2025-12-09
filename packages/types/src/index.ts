// Re-export Prisma types
export type {
  User,
  Product,
  Receipt,
  Manual,
  Manufacturer,
  MaintenanceLog,
  SmartAction,
  WarrantyClaim,
  Notification,
  AIConversation,
  Team,
  TeamMember,
  ExtendedWarranty,
  Account,
  Session,
  ReferralCode,
  AnalyticsEvent,
} from '@keeper/database';

// Re-export enums
export {
  SubscriptionTier,
  ProductCategory,
  WarrantyType,
  WarrantyStatus,
  ProductStatus,
  OCRStatus,
  ReceiptSource,
  ExpenseCategory,
  ManualType,
  ManualSource,
  WarrantyRegMethod,
  MaintenanceType,
  SmartActionType,
  ActionUrgency,
  ActionStatus,
  ClaimStatus,
  ClaimOutcome,
  ExtendedWarrantyStatus,
  ConversationStatus,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  TeamRole,
} from '@keeper/database';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// OCR TYPES
// ============================================

export interface OCRResult {
  merchantName: string | null;
  merchantAddress: string | null;
  purchaseDate: Date | null;
  totalAmount: number | null;
  taxAmount: number | null;
  subtotal: number | null;
  lineItems: LineItem[];
  confidence: number;
  rawText: string;
  currency: string;
  paymentMethod: string | null;
}

export interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
}

// ============================================
// HEALTH SCORE TYPES
// ============================================

export interface HealthScoreFactors {
  ageScore: number;
  maintenanceScore: number;
  issueScore: number;
  categoryBonus: number;
}

export interface HealthScoreResult {
  score: number;
  factors: HealthScoreFactors;
  recommendations: string[];
  trend?: HealthTrendPoint[];
}

export interface HealthTrendPoint {
  date: Date;
  score: number;
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  productId?: string;
  manualId?: string;
  maintenanceHistory?: MaintenanceLogSummary[];
  recentActions?: SmartActionSummary[];
}

export interface MaintenanceLogSummary {
  id: string;
  type: string;
  description: string;
  performedAt: Date;
  cost?: number;
}

export interface SmartActionSummary {
  id: string;
  type: string;
  title: string;
  status: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  questionsRemaining: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  subscriptionTier: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface ProductCreateInput {
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  category: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  purchaseLocation?: string;
  warrantyMonths?: number;
  location?: string;
  assignedTo?: string;
  notes?: string;
  tags?: string[];
  receiptId?: string;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  status?: string;
  productImageUrl?: string;
  manualId?: string;
}

export interface ProductFilters {
  category?: string;
  warrantyStatus?: 'active' | 'expiring' | 'expired';
  location?: string;
  search?: string;
  tags?: string[];
}

export interface ProductSort {
  field: 'createdAt' | 'purchaseDate' | 'name' | 'healthScore' | 'warrantyExpires';
  order: 'asc' | 'desc';
}

// ============================================
// RECEIPT TYPES
// ============================================

export interface ReceiptUploadResult {
  receiptId: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface ReceiptUpdateInput {
  merchantName?: string;
  merchantAddress?: string;
  purchaseDate?: Date;
  totalAmount?: number;
  taxAmount?: number;
  lineItems?: LineItem[];
  category?: string;
  isBusinessExpense?: boolean;
}

// ============================================
// MANUAL TYPES
// ============================================

export interface ManualSearchResult {
  id: string;
  brand: string;
  model: string | null;
  productName: string;
  manualType: string;
  pageCount: number | null;
  language: string;
  qualityScore: number | null;
  downloadCount: number;
}

export interface ManualContribution {
  brand: string;
  model?: string;
  productName: string;
  type: string;
  file: File;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export interface SubscriptionStatus {
  tier: string;
  status: 'active' | 'past_due' | 'cancelled' | 'none';
  currentPeriodEnd?: Date;
  features: SubscriptionFeature[];
}

export interface SubscriptionFeature {
  name: string;
  enabled: boolean;
  limit?: number;
  used?: number;
}

export interface CheckoutSession {
  sessionUrl: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface NotificationPreferences {
  warrantyAlerts: boolean;
  maintenanceReminders: boolean;
  productTips: boolean;
  recallAlerts: boolean;
  emailDigest: 'daily' | 'weekly' | 'never';
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface DashboardStats {
  totalProducts: number;
  activeWarranties: number;
  expiringWarranties: number;
  warrantyValueProtected: number;
  pendingActions: number;
}

export interface SpendingTrend {
  period: string;
  amount: number;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  totalValue: number;
}
