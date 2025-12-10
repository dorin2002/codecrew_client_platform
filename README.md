# CodeCrew Portal

A complete monorepo project built with Next.js 15, NestJS 10, TypeORM, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: NestJS 10, TypeORM 0.3, PostgreSQL 16
- **Monorepo**: Turborepo 2.x, pnpm workspaces
- **Infrastructure**: Docker, Docker Compose

## Prerequisites

- Node.js 20.x LTS
- pnpm 8.x or higher
- Docker & Docker Compose

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

### 3. Start Development Environment

Start all services (PostgreSQL, API, Web) with Docker:

```bash
pnpm docker:up
```

Wait ~30 seconds for services to initialize, then:

- **API**: http://localhost:4000/api/health
- **Frontend**: http://localhost:3000

### 4. View Logs

```bash
pnpm docker:logs
```

### 5. Stop Services

```bash
pnpm docker:down
```

## Project Structure

```
codecrew-portal/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   └── api/              # NestJS backend
├── packages/
│   └── shared/           # Shared types and utilities
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Available Scripts

### Root

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm type-check` - Type-check all packages
- `pnpm docker:up` - Start Docker services
- `pnpm docker:down` - Stop Docker services
- `pnpm docker:logs` - View service logs

### API (apps/api)

- `pnpm migration:generate` - Generate TypeORM migration
- `pnpm migration:run` - Run migrations
- `pnpm migration:revert` - Revert last migration
- `pnpm seed` - Seed the database

## Verification

After running `pnpm docker:up`:

1. Check API health:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12.345,
  "environment": "development"
}
```

2. Check frontend: Open http://localhost:3000 in your browser

## Development

### Running Locally (without Docker)

1. Start PostgreSQL:
```bash
docker-compose up -d postgres
```

2. Run API:
```bash
cd apps/api
pnpm dev
```

3. Run Frontend:
```bash
cd apps/web
pnpm dev
```

## Next Steps

This project is ready for:
- Task 2: Creating TypeORM entities and migrations
- Task 3: Implementing business logic
- Task 4: Adding authentication
- Task 5: Integrating shadcn/ui components

## License

UNLICENSED
