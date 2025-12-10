# KEEPER

A mobile-first SaaS platform for warranty tracking, manual access, and AI-powered product support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)

## Overview

KEEPER helps users manage their product warranties, access manuals, and get AI-powered support for their belongings. Never lose track of a warranty again.

### Key Features

- **Receipt Scanning**: OCR-powered receipt processing with automatic product detection
- **Warranty Tracking**: Automatic warranty expiration alerts and status monitoring
- **Manual Library**: Access product manuals instantly with smart search
- **AI Assistant**: Get help with product issues, maintenance, and troubleshooting
- **Health Scores**: Track product condition and maintenance history
- **Smart Actions**: Automated recommendations for warranty claims, maintenance, and more

## Tech Stack

### Frontend
- **Web**: Next.js 14 (App Router)
- **Mobile**: React Native with Expo
- **UI**: Custom component library with Tailwind CSS
- **State**: React Query + Zustand

### Backend
- **API**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Search**: pgvector for semantic search

### Infrastructure
- **Monorepo**: Turborepo with pnpm workspaces
- **Auth**: NextAuth.js (Google, Apple, Email)
- **Storage**: S3-compatible object storage

## Project Structure

```
keeper/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # React Native/Expo app (planned)
├── packages/
│   ├── database/            # Prisma schema and client
│   ├── ui/                  # Shared UI component library
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities
│   └── config/              # Shared configuration
└── services/
    └── api/                 # Express.js REST API
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jbapckfan/keeper.git
cd keeper
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp services/api/.env.example services/api/.env
```

4. Set up the database:
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed the database
pnpm db:seed
```

5. Start development servers:
```bash
pnpm dev
```

This starts:
- Web app at http://localhost:3000
- API server at http://localhost:3001

## Environment Variables

### Root `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/keeper"
REDIS_URL="redis://localhost:6379"
```

### Web App (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### API (`services/api/.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/keeper"
JWT_SECRET="your-jwt-secret"
REDIS_URL="redis://localhost:6379"
```

## Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm lint             # Lint all packages
pnpm test             # Run tests

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:seed          # Seed the database
pnpm db:studio        # Open Prisma Studio

# Individual apps
pnpm --filter web dev        # Start web app only
pnpm --filter api dev        # Start API only
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - List user's products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product details
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/health` - Get product health score

### Receipts
- `GET /api/receipts` - List user's receipts
- `POST /api/receipts/upload` - Upload receipt for OCR
- `GET /api/receipts/:id` - Get receipt details
- `PATCH /api/receipts/:id` - Update receipt data
- `POST /api/receipts/:id/reprocess` - Reprocess OCR
- `DELETE /api/receipts/:id` - Delete receipt

### Manuals
- `GET /api/manuals` - Search manuals
- `GET /api/manuals/:id` - Get manual details

## Database Schema

Key models:
- **User** - User accounts with auth providers
- **Product** - Tracked products with warranty info
- **Receipt** - Scanned receipts with OCR data
- **Manual** - Product manuals and documentation
- **MaintenanceLog** - Product maintenance history
- **SmartAction** - AI-generated recommendations
- **Notification** - User alerts and reminders

## Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: Inter
- **Sizes**: xs (12px) to 4xl (36px)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Roadmap

### Phase 1 (MVP)
- [x] Project setup with Turborepo
- [x] Database schema and Prisma setup
- [x] Basic API routes (auth, products, receipts)
- [x] Web app foundation
- [ ] Receipt OCR integration
- [ ] Product management UI
- [ ] Basic warranty tracking

### Phase 2
- [ ] Mobile app with Expo
- [ ] Manual library and search
- [ ] Push notifications
- [ ] Health score algorithm

### Phase 3
- [ ] AI assistant integration
- [ ] Smart action recommendations
- [ ] Extended warranty tracking
- [ ] Team/family sharing

---

Built with care by the KEEPER team.
