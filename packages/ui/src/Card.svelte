<script lang="ts">
  import type { Snippet } from 'svelte';

  interface CardProps {
    title?: string;
    children: Snippet;
    actions?: Snippet;
    padding?: boolean;
  }

  let { title, children, actions, padding = true }: CardProps = $props();

  const containerClass = $derived(padding ? 'p-6' : '');
</script>

<div class="bg-surface rounded-lg shadow-card border border-border">
  {#if title}
    <div class="px-6 py-4 border-b border-border">
      <h2 class="text-lg font-semibold text-text">{title}</h2>
    </div>
  {/if}

  <div class={containerClass}>
    {@render children()}
  </div>

  {#if actions}
    <div class="px-6 py-4 border-t border-border bg-surface-subdued rounded-b-lg">
      {@render actions()}
    </div>
  {/if}
</div>
