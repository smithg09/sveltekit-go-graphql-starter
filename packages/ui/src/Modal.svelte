<script lang="ts">
  import type { Snippet } from 'svelte';

  interface ModalProps {
    open: boolean;
    title?: string;
    children: Snippet;
    actions?: Snippet;
    onclose?: () => void;
  }

  let { open = $bindable(false), title, children, actions, onclose }: ModalProps = $props();

  function handleClose() {
    open = false;
    if (onclose) onclose();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-surface rounded-lg shadow-xl max-w-lg w-full transform transition-all"
      >
        {#if title}
          <div class="px-6 py-4 border-b border-border">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-text">{title}</h3>
              <button
                onclick={handleClose}
                aria-label="Close modal"
                class="text-text-subdued hover:text-text focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        {/if}

        <div class="px-6 py-4">
          {@render children()}
        </div>

        {#if actions}
          <div class="px-6 py-4 border-t border-border bg-surface-subdued flex justify-end gap-3">
            {@render actions()}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
