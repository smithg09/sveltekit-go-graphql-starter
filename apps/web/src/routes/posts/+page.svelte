<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Table, Badge, Modal, Pagination, Select } from '@repo/ui';
	import {
		LIST_POSTS,
		DELETE_POST,
		type ListPostsQueryResult,
		type DeletePostMutationResult,
		type DeletePostMutationVariables
	} from '$lib/graphql/posts';
	import { LIST_CATEGORIES, type ListCategoriesQueryResult } from '$lib/graphql/categories';
	import { PostStatusEnum, CategoryStatusEnum, type Category, type Post } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';
	import type { TableColumn } from '../../../../../packages/ui/dist/Table.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	let posts = $state<Post[]>([]);
	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let deleteModalOpen = $state(false);
	let postToDelete = $state<string | null>(null);
	let currentPage = $state(1);
	let pageSize = $state(10);
	let filterStatus = $state<PostStatusEnum | ''>('');
	let filterCategory = $state<string>('');

	const filteredPosts = $derived(
		posts.filter((post) => {
			if (filterStatus && post.status !== filterStatus) return false;
			if (filterCategory && post.category.id !== filterCategory) return false;
			return true;
		})
	);

	const totalItems = $derived(filteredPosts.length);
	const paginatedPosts = $derived(
		filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	const statusOptions = [
		{ value: '', label: 'All Statuses' },
		{ value: PostStatusEnum.ACTIVE, label: 'Active' },
		{ value: PostStatusEnum.PENDING, label: 'Pending' },
		{ value: PostStatusEnum.ARCHIVED, label: 'Archived' }
	];

	const categoryOptions = $derived([
		{ value: '', label: 'All Categories' },
		...categories.map((c) => ({ value: c.id, label: c.name }))
	]);

	async function loadData() {
		loading = true;
		try {
			const [postsResult, categoriesResult] = await Promise.all([
				client.query<ListPostsQueryResult>({
					query: LIST_POSTS,
					fetchPolicy: 'network-only'
				}),
				client.query<ListCategoriesQueryResult>({
					query: LIST_CATEGORIES,
					variables: {
						where: {
							status: CategoryStatusEnum.ACTIVE
						}
					}
				})
			]);

			posts = postsResult.data.listPosts;
			categories = categoriesResult.data.listCategories;
		} catch (error) {
			console.error('Error loading data:', error);
			toastStore.error('Failed to load posts');
		} finally {
			loading = false;
		}
	}

	function getStatusBadge(status: PostStatusEnum) {
		switch (status) {
			case PostStatusEnum.ACTIVE:
				return 'success';
			case PostStatusEnum.PENDING:
				return 'warning';
			case PostStatusEnum.ARCHIVED:
				return 'default';
			default:
				return 'default';
		}
	}

	function handleDelete(id: string) {
		postToDelete = id;
		deleteModalOpen = true;
	}

	async function confirmDelete() {
		if (!postToDelete) return;

		try {
			await client.mutate<DeletePostMutationResult, DeletePostMutationVariables>({
				mutation: DELETE_POST,
				variables: { id: postToDelete }
			});

			toastStore.success('Post deleted successfully');
			deleteModalOpen = false;
			postToDelete = null;
			await loadData();
		} catch (error) {
			console.error('Error deleting post:', error);
			toastStore.error('Failed to delete post');
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const columns: TableColumn<Post>[] = [
		{ key: 'title', label: 'Title' },
		{
			key: 'category',
			label: 'Category',
			render: (value: unknown) => (value as { name: string }).name as string
		},
		{
			key: 'status',
			label: 'Status',
			render: (value: unknown) => value as string
		},
		{
			key: 'created_at',
			label: 'Created',
			render: (value) => formatDate(value as string)
		},
		{
			key: 'id',
			label: 'Actions'
		}
	];

	onMount(() => {
		loadData();
	});

	$effect(() => {
		// Reset to first page when filters change
		currentPage = 1;
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text">Posts</h1>
			<p class="mt-2 text-text-subdued">Manage your blog posts</p>
		</div>
		<Button onclick={() => goto('/posts/new')}>+ New Post</Button>
	</div>

	<Card>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
			<Select label="Filter by Status" bind:value={filterStatus} options={statusOptions} />
			<Select label="Filter by Category" bind:value={filterCategory} options={categoryOptions} />
		</div>
	</Card>

	<Card padding={false}>
		{#if loading}
			<div class="text-center py-12">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
				></div>
				<p class="mt-2 text-text-subdued">Loading posts...</p>
			</div>
		{:else}
			<Table {columns} data={paginatedPosts} emptyMessage="No posts found">
				{#snippet cell(value, row, key)}
					{#if key === 'status'}
						<Badge status={getStatusBadge(value as PostStatusEnum)}>{value}</Badge>
					{:else if key === 'id'}
						<div class="flex gap-2">
							<Button variant="plain" size="sm" onclick={() => goto(`/posts/${row.id}`)}>
								Edit
							</Button>
							<Button variant="critical" size="sm" onclick={() => handleDelete(row.id as string)}>
								Delete
							</Button>
						</div>
					{:else}
						{columns.find((c) => c.key === key)?.render?.(value as string, row) ?? value ?? '-'}
					{/if}
				{/snippet}
			</Table>
			{#if totalItems > pageSize}
				<Pagination
					{currentPage}
					{totalItems}
					{pageSize}
					onPageChange={(page) => (currentPage = page)}
				/>
			{/if}
		{/if}
	</Card>
</div>

<Modal bind:open={deleteModalOpen} title="Delete Post">
	<p class="text-text">Are you sure you want to delete this post? This action cannot be undone.</p>

	{#snippet actions()}
		<Button variant="secondary" onclick={() => (deleteModalOpen = false)}>Cancel</Button>
		<Button variant="critical" onclick={confirmDelete}>Delete</Button>
	{/snippet}
</Modal>
