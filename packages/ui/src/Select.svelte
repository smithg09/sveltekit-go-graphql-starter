<script lang="ts">
  interface SelectOption {
    value: string;
    label: string;
  }

  interface SelectProps {
    label?: string;
    value: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    helpText?: string;
    required?: boolean;
    onchange?: (event: Event) => void;
  }

  let {
    label,
    value = $bindable(''),
    options,
    placeholder,
    disabled = false,
    error,
    helpText,
    required = false,
    onchange
  }: SelectProps = $props();

  const selectClass = $derived(
    error
      ? 'border-critical focus:border-critical focus:ring-critical'
      : 'border-border focus:border-primary-500 focus:ring-primary-500'
  );
</script>

<div class="w-full">
  {#if label}
    <label
      for={label?.replace(/\s+/g, '-').toLowerCase()}
      class="block text-sm font-medium text-text mb-2"
    >
      {label}
      {#if required}
        <span class="text-critical">*</span>
      {/if}
    </label>
  {/if}

  <select
    id={label?.replace(/\s+/g, '-').toLowerCase()}
    {disabled}
    {required}
    bind:value
    {onchange}
    class="block w-full px-3 py-2 border {selectClass} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-surface-disabled disabled:text-text-disabled transition-colors"
  >
    {#if placeholder}
      <option value="" disabled selected>{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>

  {#if error}
    <p class="mt-1 text-sm text-critical">{error}</p>
  {:else if helpText}
    <p class="mt-1 text-sm text-text-subdued">{helpText}</p>
  {/if}
</div>
