<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Input, Select, Textarea } from '@repo/ui';
	import {
		CREATE_POST,
		type CreatePostMutationResult,
		type CreatePostMutationVariables
	} from '$lib/graphql/posts';
	import { LIST_CATEGORIES, type ListCategoriesQueryResult } from '$lib/graphql/categories';
	import { PostStatusEnum, CategoryStatusEnum, type Category } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	let title = $state('');
	let slug = $state('');
	let content = $state('');
	let categoryId = $state('');
	let status = $state<PostStatusEnum>(PostStatusEnum.ACTIVE);
	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let submitting = $state(false);
	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: PostStatusEnum.ACTIVE, label: 'Active' },
		{ value: PostStatusEnum.PENDING, label: 'Pending' },
		{ value: PostStatusEnum.ARCHIVED, label: 'Archived' }
	];

	const categoryOptions = $derived(categories.map((c) => ({ value: c.id, label: c.name })));

	async function loadCategories() {
		loading = true;
		try {
			const result = await client.query<ListCategoriesQueryResult>({
				query: LIST_CATEGORIES,
				variables: {
					where: {
						status: CategoryStatusEnum.ACTIVE
					}
				}
			});
			categories = result.data.listCategories;
		} catch (error) {
			console.error('Error loading categories:', error);
			toastStore.error('Failed to load categories');
		} finally {
			loading = false;
		}
	}

	function generateSlug() {
		slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function validate() {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = 'Title is required';
		}

		if (!categoryId) {
			newErrors.category = 'Category is required';
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
			await client.mutate<CreatePostMutationResult, CreatePostMutationVariables>({
				mutation: CREATE_POST,
				variables: {
					data: {
						title: title.trim(),
						slug: slug.trim() || null,
						content: content.trim() || null,
						category: categoryId,
						status
					}
				}
			});

			toastStore.success('Post created successfully');
			goto('/posts');
		} catch (error: unknown) {
			console.error('Error creating post:', error);
			toastStore.error((error as Error).message || 'Failed to create post');
		} finally {
			submitting = false;
		}
	}

	onMount(() => {
		loadCategories();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-text">Create Post</h1>
			<p class="mt-2 text-text-subdued">Add a new post to your blog</p>
		</div>
		<Button variant="secondary" onclick={() => goto('/posts')}>Cancel</Button>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
			></div>
			<p class="mt-2 text-text-subdued">Loading...</p>
		</div>
	{:else if categories.length === 0}
		<Card>
			<div class="text-center py-8">
				<p class="text-text-subdued mb-4">
					You need to create at least one active category before creating posts.
				</p>
				<Button onclick={() => goto('/categories/new')}>Create Category</Button>
			</div>
		</Card>
	{:else}
		<Card>
			<form onsubmit={handleSubmit} class="space-y-6">
				<Input
					label="Title"
					bind:value={title}
					placeholder="Enter post title"
					required
					error={errors.title}
					oninput={() => {
						if (!slug) generateSlug();
						delete errors.title;
					}}
				/>

				<div class="flex gap-3 items-end">
					<div class="flex-1">
						<Input
							label="Slug"
							bind:value={slug}
							placeholder="auto-generated-from-title"
							helpText="URL-friendly version of the title"
							error={errors.slug}
							oninput={() => {
								delete errors.slug;
							}}
						/>
					</div>
					<Button type="button" variant="secondary" onclick={generateSlug}>Generate</Button>
				</div>

				<Select
					label="Category"
					bind:value={categoryId}
					options={categoryOptions}
					placeholder="Select a category"
					required
					error={errors.category}
					onchange={() => {
						delete errors.category;
					}}
				/>

				<Textarea
					label="Content"
					bind:value={content}
					placeholder="Write your post content here..."
					rows={10}
					helpText="Supports plain text content"
				/>

				<Select
					label="Status"
					bind:value={status}
					options={statusOptions}
					helpText="Set the visibility status of this post"
				/>

				<div class="flex justify-end gap-3 pt-6">
					<Button type="button" variant="secondary" onclick={() => goto('/posts')}>Cancel</Button>
					<Button type="submit" loading={submitting} disabled={submitting}>Create Post</Button>
				</div>
			</form>
		</Card>
	{/if}
</div>
