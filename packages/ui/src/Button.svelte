<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'primary' | 'secondary' | 'critical' | 'plain';
  type Size = 'sm' | 'md' | 'lg';

  interface ButtonProps {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    onclick,
    children
  }: ButtonProps = $props();

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses: Record<Variant, string> = {
    primary:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    secondary:
      'bg-surface border border-border text-text hover:bg-surface-subdued focus:ring-green-500 disabled:bg-surface-disabled disabled:text-text-disabled',
    critical: 'bg-critical text-white hover:bg-red-600 focus:ring-critical disabled:opacity-50',
    plain: 'text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:text-text-disabled'
  };

  const sizeClasses: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = $derived(
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'cursor-not-allowed opacity-60' : ''}`
  );
</script>

<button {type} class={classes} disabled={disabled || loading} {onclick}>
  {#if loading}
    <svg
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {/if}
  {@render children()}
</button>
