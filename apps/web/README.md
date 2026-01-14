# Web App (SvelteKit Frontend)

Blog administration interface built with SvelteKit 5.

## Features

- 📝 Post management (create, edit, delete)
- 📂 Category management
- 🎨 Tailwind CSS styling (Shopify-inspired)
- 🔄 Real-time updates with Apollo Client
- 📱 Responsive design
- 🎯 Form validation
- 🔔 Toast notifications
- 🔍 Filtering and pagination

## Project Structure

```
apps/web/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable components
│   │   ├── graphql/         # GraphQL queries/mutations
│   │   └── stores/          # Svelte stores
│   ├── routes/
│   │   ├── +layout.svelte   # Root layout
│   │   ├── +page.svelte     # Dashboard
│   │   ├── posts/           # Posts routes
│   │   └── categories/      # Categories routes
│   └── app.css              # Global styles
└── static/                  # Static assets
```

## GraphQL Integration

Uses Apollo Client configured in [src/lib/apollo.ts](src/lib/apollo.ts).

Queries and mutations are defined in:

- [src/lib/graphql/posts.ts](src/lib/graphql/posts.ts)
- [src/lib/graphql/categories.ts](src/lib/graphql/categories.ts)
- [src/lib/graphql/healthcheck.ts](src/lib/graphql/healthcheck.ts)

Example usage:

```typescript
import { client } from '$lib/apollo';
import { LIST_POSTS } from '$lib/graphql/posts';

const result = await client.query({
	query: LIST_POSTS,
	variables: { where: { status: 'ACTIVE' } }
});
```

## UI Components

Shared components from `@repo/ui` package:

- `Button`, `Card`, `Input`, `Select`, `Textarea`
- `Table`, `Pagination`, `Modal`, `Badge`

See [packages/ui/README.md](../../packages/ui/README.md) for component documentation.

## Development

```bash
yarn dev
```

Vite proxy configuration forwards GraphQL requests to the Go backend running on port 8080.

## Building

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

## Styling

Uses Tailwind CSS with custom theme in [tailwind.config.js](tailwind.config.js).

Color palette inspired by Shopify Polaris design system:

- Primary: Green shades
- Secondary: Blue shades
- Critical: Red shades
- Warning: Yellow shades

## Routes

- `/` - Dashboard (posts list)
- `/posts` - Posts list
- `/posts/new` - Create new post
- `/posts/[id]` - Edit post
- `/categories` - Categories list
- `/categories/new` - Create new category
- `/categories/[id]` - Edit category

## Type Safety

TypeScript types for GraphQL are defined in [src/lib/graphql/types.ts](src/lib/graphql/types.ts).

Run type checking:

```bash
yarn check-types
```

## Testing

```bash
yarn test
```

Test configuration is in [playwright.config.ts](playwright.config.ts).
