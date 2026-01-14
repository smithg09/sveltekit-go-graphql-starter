<script lang="ts" generics="T">
  /* eslint-disable no-undef */
  import type { Snippet } from 'svelte';

  export interface TableColumn<T> {
    key: keyof T & string;
    label: string;
    render?: (value: T[keyof T], row: T) => string | number | null | undefined;
  }

  export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    emptyMessage?: string;
    cell?: Snippet<[value: T[keyof T], row: T, key: keyof T & string]>;
  }

  let { columns, data, emptyMessage = 'No data available', cell }: TableProps<T> = $props();

  function getCellValue(column: TableColumn<T>, row: T) {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    return (value as unknown) ?? '-';
  }
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-border">
    <thead class="bg-surface-subdued">
      <tr>
        {#each columns as column}
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-text-subdued uppercase tracking-wider"
          >
            {column.label}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="bg-surface divide-y divide-border">
      {#if data.length === 0}
        <tr>
          <td colspan={columns.length} class="px-6 py-8 text-center text-text-subdued">
            {emptyMessage}
          </td>
        </tr>
      {:else}
        {#each data as row}
          <tr class="hover:bg-surface-subdued transition-colors">
            {#each columns as column}
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {#if cell}
                  {@render cell(row[column.key], row, column.key)}
                {:else}
                  {getCellValue(column, row)}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
