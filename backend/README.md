# StockMaster Backend

Node.js/Express backend API for the StockMaster Inventory Management System.

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
npm install
```

### Environment Setup

Copy `env.template` to `.env` and configure:

```bash
cp env.template .env
```

### Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5000`

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Seed data
├── src/
│   ├── api/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, validation, errors
│   │   └── routes/       # API routes
│   ├── services/         # Business logic
│   ├── config/          # Configuration
│   └── server.js        # Entry point
├── tests/               # Test files
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

## API Documentation

See [../docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) for complete API reference.

## Core Services

### Stock Service (`src/services/stock.service.js`)

Handles all stock operations with transactional integrity:
- `validateOperation()` - Validates operations and updates stock levels
- `getStockLevels()` - Get current inventory
- `getStockLedger()` - Get movement history
- `getLowStockAlerts()` - Get low stock alerts

## Database Schema

Key tables:
- `users` - User authentication
- `products` - Product master
- `locations` - Location master
- `stock_levels` - Current inventory
- `stock_ledger` - Transaction history

See [../backend/prisma/schema.prisma](./prisma/schema.prisma) for full schema.

