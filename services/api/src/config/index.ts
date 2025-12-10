import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-change-in-production',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  s3: {
    bucket: process.env.S3_BUCKET || 'keeper-dev',
    region: process.env.S3_REGION || 'us-east-1',
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  rateLimit: {
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    api: { windowMs: 60 * 1000, max: 100 },
    upload: { windowMs: 60 * 1000, max: 10 },
  },
};
