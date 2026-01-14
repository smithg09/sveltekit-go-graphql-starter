<script lang="ts">
  interface InputProps {
    label?: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    helpText?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'password' | 'number' | 'url';
    oninput?: (event: Event) => void;
  }

  let {
    label,
    value = $bindable(''),
    placeholder,
    disabled = false,
    error,
    helpText,
    required = false,
    type = 'text',
    oninput
  }: InputProps = $props();

  const inputClass = $derived(
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

  <input
    id={label?.replace(/\s+/g, '-').toLowerCase()}
    {type}
    {placeholder}
    {disabled}
    {required}
    bind:value
    {oninput}
    class="block w-full px-3 py-2 border {inputClass} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-surface-disabled disabled:text-text-disabled transition-colors"
  />

  {#if error}
    <p class="mt-1 text-sm text-critical">{error}</p>
  {:else if helpText}
    <p class="mt-1 text-sm text-text-subdued">{helpText}</p>
  {/if}
</div>
