<script lang="ts">
  interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }

  let { currentPage, totalItems, pageSize, onPageChange }: PaginationProps = $props();

  const totalPages = $derived(Math.ceil(totalItems / pageSize));
  const startItem = $derived((currentPage - 1) * pageSize + 1);
  const endItem = $derived(Math.min(currentPage * pageSize, totalItems));

  const canGoPrevious = $derived(currentPage > 1);
  const canGoNext = $derived(currentPage < totalPages);

  function goToPrevious() {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  }

  function goToNext() {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  }
</script>

<div class="flex items-center justify-between px-4 py-3 bg-surface border-t border-border">
  <div class="flex-1 flex justify-between sm:hidden">
    <button
      onclick={goToPrevious}
      disabled={!canGoPrevious}
      class="relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-text hover:bg-surface-subdued disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      onclick={goToNext}
      disabled={!canGoNext}
      class="ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-text hover:bg-surface-subdued disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
  <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-text-subdued">
        Showing <span class="font-medium">{startItem}</span> to
        <span class="font-medium">{endItem}</span> of
        <span class="font-medium">{totalItems}</span> results
      </p>
    </div>
    <div>
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          onclick={goToPrevious}
          disabled={!canGoPrevious}
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-surface text-sm font-medium text-text-subdued hover:bg-surface-subdued disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span
          class="relative inline-flex items-center px-4 py-2 border border-border bg-surface text-sm font-medium text-text"
        >
          Page {currentPage} of {totalPages}
        </span>
        <button
          onclick={goToNext}
          disabled={!canGoNext}
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-surface text-sm font-medium text-text-subdued hover:bg-surface-subdued disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</div>
