# Golang-SvelteKit Starter

A full-stack blog application built with Go (GraphQL backend) and SvelteKit (frontend), managed as a monorepo with Turborepo.

## Tech Stack

**Backend (Go)**

- GraphQL API with gqlgen
- PostgreSQL database
- Echo web framework
- SQLC for type-safe SQL queries
- Database migrations with golang-migrate

**Frontend (SvelteKit)**

- SvelteKit 5 with TypeScript
- Apollo Client for GraphQL
- Tailwind CSS (Shopify-inspired design)
- Shared UI component library

**Monorepo Tools**

- Turborepo for build orchestration
- pnpm/yarn for package management

## Project Structure

```
.
├── apps/
│   └── web/              # SvelteKit frontend application
├── services/
│   └── core/             # Go GraphQL backend service
├── packages/
│   ├── ui/               # Shared Svelte component library
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
└── docker-compose.yml    # Local development database
```

## Prerequisites

- Node.js >= 20
- Go >= 1.24
- Docker & Docker Compose (for PostgreSQL)
- pnpm or yarn

## Quick Start

1. **Clone and install**

```bash
git clone https://github.com/smithg09/sveltekit-go-graphql-starter.git
cd sveltekit-go-graphql-starter
make setup
# OR manually:
# yarn install
# make db-up
# cd services/core && cp .env.example .env
# make migrate-up
```

2. **Start development**

```bash
make dev
# OR
# make dev-backend    (backend only)
# make dev-frontend   (frontend only)
```

3. **Setup git hooks** (first time only)

```bash
yarn prepare
```

Now all commits will be automatically linted and formatted!

The application will be available at:

- Frontend: http://localhost:5173
- Backend GraphQL Playground: http://localhost:8080

## Development Guide

### Backend Development (services/core)

See [services/core/README.md](services/core/README.md) for detailed backend documentation.

**Common commands:**

```bash
# From root directory
make dev-backend      # Start backend with hot reload
make gqlgen          # Generate GraphQL code
make sqlc            # Generate SQLC queries
make test-backend    # Run tests with coverage
make migrate-up      # Run migrations
make migrate-down    # Rollback migration

# Generate mocks with options
make name=PostRepository mock
make name=PostRepository filename=mock_post.go mock
```

### Frontend Development (apps/web)

**Common commands:**

```bash
cd apps/web

# Development server
yarn dev

# Build for production
yarn build

# Type checking
yarn check-types

# Linting
yarn lint
```

### UI Component Library (packages/ui)

Shared Svelte components used across applications.

```bash
cd packages/ui

# Watch mode during development
yarn dev

# Build library
yarn build
```

## Features

- ✅ CRUD operations for blog posts and categories
- ✅ GraphQL API with type-safe queries
- ✅ Database migrations
- ✅ Form validation
- ✅ Toast notifications
- ✅ Responsive UI with Tailwind CSS
- ✅ Pagination and filtering
- ✅ Modal dialogs
- ✅ Status badges
- ✅ Pre-commit hooks for code quality
- ✅ Conventional commit enforcement

## Architecture Decisions

### Backend

- **GraphQL over REST**: Flexible data fetching, strong typing
- **SQLC**: Type-safe SQL queries without ORM overhead
- **Echo**: Lightweight, high-performance HTTP framework
- **Database migrations**: Version-controlled schema changes

### Frontend

- **SvelteKit**: Modern framework with excellent DX
- **Apollo Client**: Robust GraphQL client with caching
- **Monorepo UI package**: Reusable components across apps
- **Tailwind CSS**: Utility-first styling

## Testing

```bash
# Backend tests
cd services/core
go test ./...

# Frontend tests (if configured)
cd apps/web
yarn test
```

## Deployment

### Option 1: Traditional Build

#### Backend

```bash
cd services/core
make build-backend
# Binary available at build/core
```

#### Frontend

```bash
cd apps/web
yarn build
# Output in .svelte-kit/output
```

### Option 2: Docker

#### Build Docker Images

**Backend (Go service):**

```bash
docker build -t golang-sveltekit-core:latest -f services/core/Dockerfile services/core/
```

**Frontend (SvelteKit app):**

```bash
docker build -t golang-sveltekit-web:latest -f apps/web/Dockerfile .
```

Make sure to configure environment variables while running the images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - see LICENSE file for details
