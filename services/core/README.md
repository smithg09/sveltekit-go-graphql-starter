# Core Service (Go Backend)

GraphQL API backend for the blog application.

## Architecture

```
services/core/
├── cmd/core/              # Application entry point
│   ├── graph/             # GraphQL resolvers (generated)
│   └── main.go
├── internal/
│   ├── actor/server/      # HTTP server (Echo)
│   ├── module/            # Domain modules
│   │   ├── category/
│   │   └── post/
│   └── util/              # Shared utilities
└── db/migration/          # SQL migrations
```

**Note:** All build and development commands use the **root Makefile**. Run `make help` from the project root to see available commands.

## GraphQL Schema

The API provides the following operations:

### Queries

- `getPost(id: Uuid!): Post`
- `listPosts(where: WherePostsDto): [Post!]!`
- `getCategory(id: Uuid!): Category`
- `listCategories(where: WhereCategoriesDto): [Category!]!`
- `healthcheck: String!`

### Mutations

- `createPost(data: CreatePostDto!): Post`
- `updatePost(id: Uuid!, data: UpdatePostDto!): Post`
- `deletePost(id: Uuid!): Boolean`
- `createCategory(data: CreateCategoryDto!): Category`
- `updateCategory(id: Uuid!, data: UpdateCategoryDto!): Category`
- `deleteCategory(id: Uuid!): Boolean`

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
# Application
ENVIRONMENT=development
LOG_LEVEL=debug

# PostgreSQL
POSTGRES_URI=postgresql://postgres:supersecretpassword@localhost:5439
POSTGRES_DATABASE=sveltekit-go-graphql-starter
POSTGRES_IS_SSL_DISABLED=true
```

## Development

### Hot Reload

Uses [Air](https://github.com/cosmtrek/air) for hot reloading:

```bash
# From root directory
make dev-backend

# Or from services/core
yarn dev
```

### Generate GraphQL Code

After modifying `.graphql` schema files:

```bash
# From root directory
make gqlgen
```

### Generate SQLC Queries

After modifying SQL queries in `internal/module/*/sql/`:

```bash
# From root directory
make sqlc
```

### Database Migrations

All migration commands should be run from the **root directory**:

```bash
# Apply all pending migrations
make migrate-up

# Rollback last migration
make migrate-down

# Jump to specific version
make version=3 migrate-goto

# Force version (use with caution)
make version=3 migrate-force

# Check current version
make migrate-version
```

### Testing

```bash
# From root directory
make test-backend

# Run specific test
cd services/core && go test ./internal/module/post/... -v

# Generate mocks (from root)
make name=PostRepository mock

# With optional parameters
make name=PostRepository filename=mock_post_repo.go mock
make name=PostRepository srcpkg=github.com/yourpkg/internal/module/post mock
```

## Adding New Features

### 1. Add GraphQL Schema

Create `internal/module/yourmodule/schema.graphql`:

```graphql
type YourType {
  id: Uuid!
  name: String!
}

extend type Query {
  getYourType(id: Uuid!): YourType
}

extend type Mutation {
  createYourType(data: CreateYourTypeDto!): YourType
}
```

### 2. Generate Code

```bash
make gqlgen
```

### 3. Implement Resolvers

Edit generated files in `cmd/core/graph/`

### 4. Add Database Layer

- Create migration: `db/migration/XXXXXX_your_feature.up.sql`
- Add SQLC queries: `internal/module/yourmodule/sql/`
- Generate: `make sqlc`

## Production Build

```bash
# From root directory
make build-backend
# Binary: services/core/build/core
```

Run the binary:

```bash
cd services/core
./build/core
```

## Troubleshooting

**GraphQL generation fails**

- Ensure all schema files are valid GraphQL
- Check gqlgen.yml configuration in `cmd/core/gqlgen.yml`

**Database connection errors**

- Verify PostgreSQL is running: `docker-compose ps`
- Check connection string in `.env`

**Migration errors**

- Check migration files syntax
- Use `make migrate-version` to see current state
- Use `make migrate-force` to fix stuck migrations

**Air not found**

- Install Air: `go install github.com/cosmtrek/air@latest`
- Or use: `go run cmd/core/main.go`
