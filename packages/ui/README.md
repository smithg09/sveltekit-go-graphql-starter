# UI Component Library

Shared Svelte 5 component library used across applications.

## Components

### Button

```svelte
<script>
  import { Button } from '@repo/ui';
</script>

<Button variant="primary" size="md" onclick={handleClick}>Click Me</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'critical' | 'plain' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `fullWidth`: boolean (default: false)
- `onclick`: function

### Input

```svelte
<script>
  import { Input } from '@repo/ui';
</script>

<Input label="Email" bind:value={email} type="email" error={errors.email} required />
```

**Props:**

- `label`: string
- `value`: string
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `placeholder`: string
- `error`: string
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)

### Select

```svelte
<script>
  import { Select } from '@repo/ui';
</script>

<Select
  label="Status"
  bind:value={status}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' }
  ]}
/>
```

**Props:**

- `label`: string
- `value`: string
- `options`: Array<{ value: string, label: string }>
- `placeholder`: string
- `error`: string
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)

### Textarea

```svelte
<script>
  import { Textarea } from '@repo/ui';
</script>

<Textarea label="Content" bind:value={content} rows={10} placeholder="Write something..." />
```

**Props:**

- `label`: string
- `value`: string
- `rows`: number (default: 4)
- `placeholder`: string
- `error`: string
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)

### Card

```svelte
<script>
  import { Card } from '@repo/ui';
</script>

<Card title="Card Title">
  <p>Card content</p>

  {#snippet actions()}
    <Button>Action</Button>
  {/snippet}
</Card>
```

**Props:**

- `title`: string
- `children`: snippet (default content)
- `actions`: snippet (optional actions slot)

### Modal

```svelte
<script>
  import { Modal } from '@repo/ui';
  let open = $state(false);
</script>

<Modal bind:open title="Confirm Action">
  <p>Are you sure?</p>

  {#snippet actions()}
    <Button variant="secondary" onclick={() => (open = false)}>Cancel</Button>
    <Button variant="critical" onclick={handleConfirm}>Delete</Button>
  {/snippet}
</Modal>
```

**Props:**

- `open`: boolean (two-way binding)
- `title`: string
- `children`: snippet (modal content)
- `actions`: snippet (modal actions)

### Table

```svelte
<script>
  import { Table } from '@repo/ui';
</script>

<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
  data={users}
  emptyMessage="No users found"
>
  {#snippet cell(value, row, key)}
    {#if key === 'name'}
      <strong>{value}</strong>
    {:else}
      {value}
    {/if}
  {/snippet}
</Table>
```

**Props:**

- `columns`: Array<{ key: string, label: string }>
- `data`: Array<object>
- `emptyMessage`: string
- `cell`: snippet (custom cell rendering)

### Badge

```svelte
<script>
  import { Badge } from '@repo/ui';
</script>

<Badge status="success">Active</Badge>
<Badge status="warning">Pending</Badge>
<Badge status="critical">Error</Badge>
<Badge status="info">Draft</Badge>
```

**Props:**

- `status`: 'success' | 'warning' | 'critical' | 'info' (default: 'info')
- `children`: snippet (badge text)

### Pagination

```svelte
<script>
  import { Pagination } from '@repo/ui';
  let currentPage = $state(1);
</script>

<Pagination
  currentPage={1}
  totalItems={100}
  pageSize={10}
  onPageChange={(page) => (currentPage = page)}
/>
```

**Props:**

- `currentPage`: number
- `totalItems`: number
- `pageSize`: number (default: 10)
- `onPageChange`: function

## Development

```bash
# Watch mode
yarn dev

# Build library
yarn build
```

## Adding New Components

1. Create component in `src/YourComponent.svelte`
2. Export from `src/index.ts`:
   ```typescript
   export { default as YourComponent } from './YourComponent.svelte';
   ```
3. Rebuild: `yarn build`
4. Use in apps:
   ```svelte
   import {YourComponent} from '@repo/ui';
   ```

## Styling

Components use Tailwind CSS utility classes. Ensure your app has Tailwind configured with the same theme.

## TypeScript Support

All components are fully typed with TypeScript for excellent autocomplete and type checking.
