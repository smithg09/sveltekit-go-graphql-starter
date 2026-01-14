<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Input, Select } from '@repo/ui';
	import {
		CREATE_CATEGORY,
		type CreateCategoryMutationResult,
		type CreateCategoryMutationVariables
	} from '$lib/graphql/categories';
	import { CategoryStatusEnum } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	let name = $state('');
	let slug = $state('');
	let status = $state<CategoryStatusEnum>(CategoryStatusEnum.ACTIVE);
	let submitting = $state(false);
	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: CategoryStatusEnum.ACTIVE, label: 'Active' },
		{ value: CategoryStatusEnum.PENDING, label: 'Pending' },
		{ value: CategoryStatusEnum.ARCHIVED, label: 'Archived' }
	];

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

		if (!validate()) {
			toastStore.error('Please fix the validation errors');
			return;
		}

		submitting = true;

		try {
			await client.mutate<CreateCategoryMutationResult, CreateCategoryMutationVariables>({
				mutation: CREATE_CATEGORY,
				variables: {
					data: {
						name: name.trim(),
						slug: slug.trim() || null,
						status
					}
				}
			});

			toastStore.success('Category created successfully');
			goto('/categories');
		} catch (error: unknown) {
			console.error('Error creating category:', error);
			toastStore.error((error as Error).message || 'Failed to create category');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text">Create Category</h1>
			<p class="mt-2 text-text-subdued">Add a new category to your blog</p>
		</div>
		<Button variant="secondary" onclick={() => goto('/categories')}>Cancel</Button>
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
					if (!slug) generateSlug();
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
				<Button type="submit" loading={submitting} disabled={submitting}>Create Category</Button>
			</div>
		</form>
	</Card>
</div>
