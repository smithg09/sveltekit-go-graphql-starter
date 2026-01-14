<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { client } from '$lib/apollo';
	import { page } from '$app/stores';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	setContext('apollo', client);

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: 'home' },
		{ href: '/posts', label: 'Posts', icon: 'document' },
		{ href: '/categories', label: 'Categories', icon: 'folder' }
	];

	function isActive(href: string): boolean {
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen flex">
	<!-- Sidebar -->
	<aside class="w-64 bg-surface border-r border-border flex-shrink-0">
		<div class="p-6 border-b border-border">
			<h1 class="text-xl font-bold text-text">Blog Admin</h1>
		</div>
		<nav class="p-4 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors {isActive(
						item.href
					)
						? 'bg-surface-subdued text-text'
						: 'text-text-subdued hover:bg-surface-subdued hover:text-text'}"
				>
					{#if item.icon === 'home'}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					{:else if item.icon === 'document'}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					{:else if item.icon === 'folder'}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
							/>
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		<div class="container mx-auto px-6 py-8 max-w-7xl">
			{@render children()}
		</div>
	</main>

	<ToastContainer />
</div>
