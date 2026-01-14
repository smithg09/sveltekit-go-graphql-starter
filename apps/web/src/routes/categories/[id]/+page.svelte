<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Input, Select, Modal } from '@repo/ui';
	import {
		GET_CATEGORY,
		UPDATE_CATEGORY,
		DELETE_CATEGORY,
		type GetCategoryQueryResult,
		type GetCategoryQueryVariables,
		type UpdateCategoryMutationResult,
		type UpdateCategoryMutationVariables,
		type DeleteCategoryMutationResult,
		type DeleteCategoryMutationVariables
	} from '$lib/graphql/categories';
	import { CategoryStatusEnum } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	const categoryId = $derived($page.params.id);

	let name = $state('');
	let slug = $state('');
	let status = $state<CategoryStatusEnum>(CategoryStatusEnum.ACTIVE);
	let loading = $state(true);
	let submitting = $state(false);
	let deleteModalOpen = $state(false);
	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: CategoryStatusEnum.ACTIVE, label: 'Active' },
		{ value: CategoryStatusEnum.PENDING, label: 'Pending' },
		{ value: CategoryStatusEnum.ARCHIVED, label: 'Archived' }
	];

	async function loadCategory() {
		if (!categoryId) {
			toastStore.error('Category ID is missing');
			goto('/categories');
			return;
		}
		loading = true;
		try {
			const result = await client.query<GetCategoryQueryResult, GetCategoryQueryVariables>({
				query: GET_CATEGORY,
				variables: { id: categoryId },
				fetchPolicy: 'network-only'
			});

			if (result.data.getCategory) {
				const category = result.data.getCategory;
				name = category.name;
				slug = category.slug || '';
				status = category.status;
			} else {
				toastStore.error('Category not found');
				goto('/categories');
			}
		} catch (error) {
			console.error('Error loading category:', error);
			toastStore.error('Failed to load category');
			goto('/categories');
		} finally {
			loading = false;
		}
	}

	function generateSlug() {
		slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function validate() {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (slug && !/^[a-z0-9-]+$/.test(slug)) {
			newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!categoryId) {
			toastStore.error('Category ID is missing');
			return;
		}

		if (!validate()) {
			toastStore.error('Please fix the validation errors');
			return;
		}

		submitting = true;

		try {
			await client.mutate<UpdateCategoryMutationResult, UpdateCategoryMutationVariables>({
				mutation: UPDATE_CATEGORY,
				variables: {
					id: categoryId,
					data: {
						name: name.trim(),
						slug: slug.trim() || null,
						status
					}
				}
			});

			toastStore.success('Category updated successfully');
			goto('/categories');
		} catch (error: unknown) {
			console.error('Error updating category:', error);
			toastStore.error((error as Error).message || 'Failed to update category');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		if (!categoryId) {
			toastStore.error('Category ID is missing');
			return;
		}
		try {
			await client.mutate<DeleteCategoryMutationResult, DeleteCategoryMutationVariables>({
				mutation: DELETE_CATEGORY,
				variables: { id: categoryId }
			});

			toastStore.success('Category deleted successfully');
			goto('/categories');
		} catch (error) {
			console.error('Error deleting category:', error);
			toastStore.error('Failed to delete category');
		}
	}

	onMount(() => {
		loadCategory();
	});
</script>

<div class="space-y-6">
	{#if loading}
		<div class="text-center py-12">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
			></div>
			<p class="mt-2 text-text-subdued">Loading category...</p>
		</div>
	{:else}
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-text">Edit Category</h1>
				<p class="mt-2 text-text-subdued">Update category information</p>
			</div>
			<div class="flex gap-3">
				<Button variant="critical" onclick={() => (deleteModalOpen = true)}>Delete</Button>
				<Button variant="secondary" onclick={() => goto('/categories')}>Cancel</Button>
			</div>
		</div>

		<Card>
			<form onsubmit={handleSubmit} class="space-y-6">
				<Input
					label="Name"
					bind:value={name}
					placeholder="Enter category name"
					required
					error={errors.name}
					oninput={() => {
						delete errors.name;
					}}
				/>

				<div class="flex gap-3 items-end">
					<div class="flex-1">
						<Input
							label="Slug"
							bind:value={slug}
							placeholder="auto-generated-from-name"
							helpText="URL-friendly version of the name"
							error={errors.slug}
							oninput={() => {
								delete errors.slug;
							}}
						/>
					</div>
					<Button type="button" variant="secondary" onclick={generateSlug}>Generate</Button>
				</div>

				<Select
					label="Status"
					bind:value={status}
					options={statusOptions}
					helpText="Set the visibility status of this category"
				/>

				<div class="flex justify-end gap-3 pt-6">
					<Button type="button" variant="secondary" onclick={() => goto('/categories')}>
						Cancel
					</Button>
					<Button type="submit" loading={submitting} disabled={submitting}>Update Category</Button>
				</div>
			</form>
		</Card>
	{/if}
</div>

<Modal bind:open={deleteModalOpen} title="Delete Category">
	<p class="text-text">
		Are you sure you want to delete this category? This action cannot be undone.
	</p>

	{#snippet actions()}
		<Button variant="secondary" onclick={() => (deleteModalOpen = false)}>Cancel</Button>
		<Button variant="critical" onclick={handleDelete}>Delete</Button>
	{/snippet}
</Modal>
