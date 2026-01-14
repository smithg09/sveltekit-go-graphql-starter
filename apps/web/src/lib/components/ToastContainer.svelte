<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const typeStyles = {
		success: 'bg-success text-white',
		error: 'bg-critical text-white',
		warning: 'bg-warning text-white',
		info: 'bg-info text-white'
	};
</script>

<div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
	{#each toastStore.toasts as toast (toast.id)}
		<div
			class="pointer-events-auto flex items-center gap-2 min-w-[300px] px-4 py-3 rounded-lg shadow-lg {typeStyles[
				toast.type
			]} animate-slide-in"
		>
			<div class="flex-1">
				<p class="text-sm font-medium">{toast.message}</p>
			</div>
			<button
				onclick={() => toastStore.remove(toast.id)}
				aria-label="Close notification"
				class="flex-shrink-0 hover:opacity-75 transition-opacity"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>
