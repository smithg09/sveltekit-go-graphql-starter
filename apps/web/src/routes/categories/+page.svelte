<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Table, Badge, Modal, Pagination } from '@repo/ui';
	import {
		LIST_CATEGORIES,
		DELETE_CATEGORY,
		type ListCategoriesQueryResult,
		type DeleteCategoryMutationResult,
		type DeleteCategoryMutationVariables
	} from '$lib/graphql/categories';
	import { CategoryStatusEnum } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	let categories = $state<Array<Record<string, unknown>>>([]);
	let loading = $state(true);
	let deleteModalOpen = $state(false);
	let categoryToDelete = $state<string | null>(null);
	let currentPage = $state(1);
	let pageSize = $state(10);

	const totalItems = $derived(categories.length);
	const paginatedCategories = $derived(
		categories.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	async function loadCategories() {
		loading = true;
		try {
			const result = await client.query<ListCategoriesQueryResult>({
				query: LIST_CATEGORIES,
				fetchPolicy: 'network-only'
			});
			categories = result.data.listCategories as unknown as Record<string, unknown>[];
		} catch (error) {
			console.error('Error loading categories:', error);
			toastStore.error('Failed to load categories');
		} finally {
			loading = false;
		}
	}

	function getStatusBadge(status: CategoryStatusEnum) {
		switch (status) {
			case CategoryStatusEnum.ACTIVE:
				return 'success';
			case CategoryStatusEnum.PENDING:
				return 'warning';
			case CategoryStatusEnum.ARCHIVED:
				return 'default';
			default:
				return 'default';
		}
	}

	function handleDelete(id: string) {
		categoryToDelete = id;
		deleteModalOpen = true;
	}

	async function confirmDelete() {
		if (!categoryToDelete) return;

		try {
			await client.mutate<DeleteCategoryMutationResult, DeleteCategoryMutationVariables>({
				mutation: DELETE_CATEGORY,
				variables: { id: categoryToDelete }
			});

			toastStore.success('Category deleted successfully');
			deleteModalOpen = false;
			categoryToDelete = null;
			await loadCategories();
		} catch (error) {
			console.error('Error deleting category:', error);
			toastStore.error('Failed to delete category');
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'slug', label: 'Slug' },
		{
			key: 'status',
			label: 'Status',
			render: (value: unknown) => value as string
		},
		{
			key: 'created_at',
			label: 'Created',
			render: (value: unknown) => formatDate(value as string)
		},
		{
			key: 'id',
			label: 'Actions'
		}
	];

	onMount(() => {
		loadCategories();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text">Categories</h1>
			<p class="mt-2 text-text-subdued">Manage your blog categories</p>
		</div>
		<Button onclick={() => goto('/categories/new')}>+ New Category</Button>
	</div>

	<Card padding={false}>
		{#if loading}
			<div class="text-center py-12">
				<div
					class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
				></div>
				<p class="mt-2 text-text-subdued">Loading categories...</p>
			</div>
		{:else}
			<Table {columns} data={paginatedCategories} emptyMessage="No categories found">
				{#snippet cell(value, row, key)}
					{#if key === 'status'}
						<Badge status={getStatusBadge(value as CategoryStatusEnum)}>{value}</Badge>
					{:else if key === 'id'}
						<div class="flex gap-2">
							<Button variant="plain" size="sm" onclick={() => goto(`/categories/${row.id}`)}>
								Edit
							</Button>
							<Button variant="critical" size="sm" onclick={() => handleDelete(row.id as string)}>
								Delete
							</Button>
						</div>
					{:else}
						{columns.find((c) => c.key === key)?.render?.(value as CategoryStatusEnum) ??
							value ??
							'-'}
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

<Modal bind:open={deleteModalOpen} title="Delete Category">
	<p class="text-text">
		Are you sure you want to delete this category? This action cannot be undone.
	</p>

	{#snippet actions()}
		<Button variant="secondary" onclick={() => (deleteModalOpen = false)}>Cancel</Button>
		<Button variant="critical" onclick={confirmDelete}>Delete</Button>
	{/snippet}
</Modal>
