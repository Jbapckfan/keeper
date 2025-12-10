import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import receiptRoutes from './routes/receipts';
import manualRoutes from './routes/manuals';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.0.1',
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'Keeper API',
    version: '0.0.1',
    documentation: 'https://docs.usekeeper.com/api',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/manuals', manualRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
