<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Badge } from '@repo/ui';
	import { LIST_CATEGORIES, type ListCategoriesQueryResult } from '$lib/graphql/categories';
	import { LIST_POSTS, type ListPostsQueryResult } from '$lib/graphql/posts';
	import { CategoryStatusEnum, PostStatusEnum } from '$lib/graphql/types';
	import { HEATHCHECK_PING } from '$lib/graphql/healthcheck';

	const client = getContext<ApolloClient<unknown>>('apollo');

	let loading = $state(true);
	let healthStatus = $state<'unknown' | 'healthy' | 'unhealthy'>('unknown');
	let totalPosts = $state(0);
	let totalCategories = $state(0);
	let activePosts = $state(0);
	let activeCategories = $state(0);

	onMount(async () => {
		try {
			const [postsResult, categoriesResult, healthcheckResult] = await Promise.all([
				client.query<ListPostsQueryResult>({ query: LIST_POSTS }),
				client.query<ListCategoriesQueryResult>({ query: LIST_CATEGORIES }),
				client.query<{ ping: string }>({ query: HEATHCHECK_PING })
			]);

			const posts = postsResult.data.listPosts;
			const categories = categoriesResult.data.listCategories;
			const pingResponse = healthcheckResult.data.ping;

			healthStatus = pingResponse ? 'healthy' : 'unhealthy';
			totalPosts = posts.length;
			totalCategories = categories.length;
			activePosts = posts.filter((p) => p.status === PostStatusEnum.ACTIVE).length;
			activeCategories = categories.filter((c) => c.status === CategoryStatusEnum.ACTIVE).length;
		} catch (error) {
			healthStatus = 'unhealthy';
			console.error('Error fetching dashboard data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-text">Dashboard</h1>
		<p class="mt-2 text-text-subdued">Welcome to your blog management system</p>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
			></div>
			<p class="mt-2 text-text-subdued">Loading statistics...</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card>
				<div class="space-y-2">
					<p class="text-sm font-medium text-text-subdued">Total Posts</p>
					<p class="text-3xl font-bold text-text">{totalPosts}</p>
					<Badge status="info">{activePosts} Active</Badge>
				</div>
			</Card>

			<Card>
				<div class="space-y-2">
					<p class="text-sm font-medium text-text-subdued">Total Categories</p>
					<p class="text-3xl font-bold text-text">{totalCategories}</p>
					<Badge status="success">{activeCategories} Active</Badge>
				</div>
			</Card>

			<Card>
				<div class="space-y-2">
					<p class="text-sm font-medium text-text-subdued">Pending Posts</p>
					<p class="text-3xl font-bold text-text">
						{totalPosts - activePosts}
					</p>
					<Badge status="warning">Needs Review</Badge>
				</div>
			</Card>

			<Card>
				<div class="space-y-2">
					<p class="text-sm font-medium text-text-subdued">Quick Actions</p>
					<div class="space-y-2 mt-4">
						<a
							href="/posts/new"
							class="block text-sm text-primary-600 hover:text-primary-700 font-medium"
						>
							+ New Post
						</a>
						<a
							href="/categories/new"
							class="block text-sm text-primary-600 hover:text-primary-700 font-medium"
						>
							+ New Category
						</a>
					</div>
				</div>
			</Card>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card title="System Health">
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm text-text-subdued">GraphQL API</span>
						<Badge status={healthStatus != 'healthy' ? 'critical' : 'success'}>{healthStatus}</Badge
						>
					</div>
				</div>
			</Card>
		</div>
	{/if}
</div>
