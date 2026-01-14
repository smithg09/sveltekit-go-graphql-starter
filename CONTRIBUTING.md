# Contributing to Golang-SvelteKit Starter

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/smithg09/sveltekit-go-graphql-starter.git
   cd sveltekit-go-graphql-starter
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start PostgreSQL**

   ```bash
   make db-up
   ```

4. **Setup backend environment**

   ```bash
   cd services/core
   cp .env.example .env
   # Edit .env if needed
   ```

5. **Run database migrations**

   ```bash
   make migrate-up
   ```

6. **Install git hooks**

   ```bash
   yarn prepare
   ```

7. **Start development servers**
   ```bash
   make dev
   ```

## Coding Standards

### General

- Write clean, maintainable, and well-documented code
- Follow existing code style and patterns
- Add comments for complex logic
- Write meaningful commit messages

### Go (Backend)

- Follow standard Go conventions and idioms
- Use `gofmt` for formatting (automatic via pre-commit hook)
- Use `goimports` for import management
- Write table-driven tests where appropriate
- Keep functions small and focused
- Use descriptive variable and function names

### TypeScript/Svelte (Frontend)

- Use ESLint and Prettier (configured and automatic via pre-commit hook)
- Follow TypeScript best practices
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Prefer composition over inheritance
- Use functional programming patterns where appropriate

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Format: `<type>(scope): <subject>`

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

**Examples:**

```bash
feat(posts): add pagination support
fix(categories): resolve delete confirmation bug
docs(readme): update installation instructions
refactor(backend): simplify error handling
test(posts): add unit tests for post service
```

## Pre-commit Hooks

The project uses Husky and lint-staged to enforce code quality:

1. **Automatic formatting and linting** on staged files
2. **Type checking** for TypeScript/Svelte files
3. **Commit message validation**

These run automatically when you commit. To bypass (not recommended):

```bash
git commit --no-verify
```

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write code
   - Add tests if applicable
   - Update documentation

3. **Ensure quality checks pass**

   ```bash
   yarn lint
   yarn check-types
   make test
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure CI checks pass

## Adding Features

### Backend (Go)

1. **Add GraphQL schema**
   Create or modify schema in `services/core/internal/module/yourmodule/schema.graphql`:

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

2. **Generate GraphQL code**

   ```bash
   make gqlgen
   ```

3. **Implement resolvers**
   Edit generated files in `services/core/cmd/core/graph/`

4. **Add database layer**
   - Create migration: `services/core/db/migration/XXXXXX_your_feature.up.sql`
   - Add SQLC queries: `services/core/internal/module/yourmodule/sql/`
   - Generate: `make sqlc`

5. **Write tests**
   ```bash
   go test ./internal/module/yourmodule/... -v
   ```

### Frontend (SvelteKit)

1. **Create routes**
   Add files in `apps/web/src/routes/yourfeature/`

2. **Add GraphQL queries**
   Create queries in `apps/web/src/lib/graphql/yourfeature.ts`:

   ```typescript
   import { gql } from '@apollo/client';

   export const GET_YOUR_TYPE = gql`
     query GetYourType($id: Uuid!) {
       getYourType(id: $id) {
         id
         name
       }
     }
   `;
   ```

3. **Use UI components**
   Import from `@repo/ui`:

   ```svelte
   <script>
     import { Button, Card, Input } from '@repo/ui';
   </script>
   ```

4. **Add types**
   Update `apps/web/src/lib/graphql/types.ts` with GraphQL types

### UI Components

1. **Create component**
   Add file in `packages/ui/src/YourComponent.svelte`:

   ```svelte
   <script lang="ts">
     interface Props {
       // Define props
     }

     let { ...props }: Props = $props();
   </script>

   <!-- Component markup -->
   ```

2. **Export component**
   Add to `packages/ui/src/index.ts`:

   ```typescript
   export { default as YourComponent } from './YourComponent.svelte';
   ```

3. **Rebuild**
   ```bash
   cd packages/ui
   yarn build
   ```

## Testing

### Backend Tests

```bash
# Run all tests
make test-backend

# Run specific module tests
cd services/core
go test ./internal/module/post/... -v

# Generate test coverage
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

### Frontend Tests

```bash
cd apps/web
yarn test
```

## Database Migrations

### Creating a Migration

1. **Create migration files**

   ```bash
   cd services/core/db/migration
   # Create files: XXXXXX_description.up.sql and XXXXXX_description.down.sql
   ```

2. **Write SQL**
   - `.up.sql`: Changes to apply
   - `.down.sql`: How to rollback changes

3. **Apply migration**

   ```bash
   make migrate-up
   ```

4. **Test rollback**
   ```bash
   make migrate-down
   make migrate-up
   ```

### Migration Best Practices

- Keep migrations small and focused
- Always provide a rollback (down migration)
- Test migrations before committing
- Never modify existing migrations that are in production

## Debugging

### Backend

Use `LOG_LEVEL=debug` in `.env` for detailed logs.

### Frontend

Use browser DevTools and check:

- Console for errors
- Network tab for GraphQL requests
- Apollo Client DevTools extension

## Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Review existing issues and PRs

## Code Review Guidelines

When reviewing pull requests:

- Be respectful and constructive
- Focus on code quality and maintainability
- Suggest improvements with explanations
- Approve when satisfied with changes

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
