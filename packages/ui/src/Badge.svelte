<script lang="ts">
  import type { Snippet } from 'svelte';

  type Status = 'success' | 'warning' | 'critical' | 'info' | 'default';

  interface BadgeProps {
    status?: Status;
    children: Snippet;
  }

  let { status = 'default', children }: BadgeProps = $props();

  const statusClasses: Record<Status, string> = {
    success: 'bg-success-subdued text-success border-success/20',
    warning: 'bg-warning-subdued text-warning border-warning/20',
    critical: 'bg-critical-subdued text-critical border-critical/20',
    info: 'bg-info-subdued text-info border-info/20',
    default: 'bg-surface-subdued text-text-subdued border-border'
  };

  const classes = $derived(
    `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusClasses[status]}`
  );
</script>

<span class={classes}>
  {@render children()}
</span>
