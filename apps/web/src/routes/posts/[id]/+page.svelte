<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ApolloClient } from '@apollo/client/core';
	import { Card, Button, Input, Select, Textarea, Modal } from '@repo/ui';
	import {
		GET_POST,
		UPDATE_POST,
		DELETE_POST,
		type GetPostQueryResult,
		type GetPostQueryVariables,
		type UpdatePostMutationResult,
		type UpdatePostMutationVariables,
		type DeletePostMutationResult,
		type DeletePostMutationVariables
	} from '$lib/graphql/posts';
	import { LIST_CATEGORIES, type ListCategoriesQueryResult } from '$lib/graphql/categories';
	import { PostStatusEnum, CategoryStatusEnum, type Category } from '$lib/graphql/types';
	import { toastStore } from '$lib/stores/toastStore.svelte';

	const client = getContext<ApolloClient<unknown>>('apollo');

	const postId = $derived($page.params.id);

	let title = $state('');
	let slug = $state('');
	let content = $state('');
	let categoryId = $state('');
	let status = $state<PostStatusEnum>(PostStatusEnum.ACTIVE);
	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let submitting = $state(false);
	let deleteModalOpen = $state(false);
	let errors = $state<Record<string, string>>({});

	const statusOptions = [
		{ value: PostStatusEnum.ACTIVE, label: 'Active' },
		{ value: PostStatusEnum.PENDING, label: 'Pending' },
		{ value: PostStatusEnum.ARCHIVED, label: 'Archived' }
	];

	const categoryOptions = $derived(categories.map((c) => ({ value: c.id, label: c.name })));

	async function loadData() {
		if (!postId) {
			toastStore.error('Post ID is missing');
			goto('/posts');
			return;
		}
		loading = true;
		try {
			const [postResult, categoriesResult] = await Promise.all([
				client.query<GetPostQueryResult, GetPostQueryVariables>({
					query: GET_POST,
					variables: { id: postId },
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

			if (postResult.data.getPost) {
				const post = postResult.data.getPost;
				title = post.title;
				slug = post.slug;
				content = post.content || '';
				categoryId = post.category.id;
				status = post.status;
			} else {
				toastStore.error('Post not found');
				goto('/posts');
			}

			categories = categoriesResult.data.listCategories;
		} catch (error) {
			console.error('Error loading data:', error);
			toastStore.error('Failed to load post');
			goto('/posts');
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

		if (!postId) {
			toastStore.error('Post ID is missing');
			return;
		}

		if (!validate()) {
			toastStore.error('Please fix the validation errors');
			return;
		}

		submitting = true;

		try {
			await client.mutate<UpdatePostMutationResult, UpdatePostMutationVariables>({
				mutation: UPDATE_POST,
				variables: {
					id: postId,
					data: {
						title: title.trim(),
						slug: slug.trim() || null,
						content: content.trim() || null,
						category: categoryId,
						status
					}
				}
			});

			toastStore.success('Post updated successfully');
			goto('/posts');
		} catch (error: unknown) {
			console.error('Error updating post:', error);
			toastStore.error((error as Error).message || 'Failed to update post');
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		if (!postId) {
			toastStore.error('Post ID is missing');
			return;
		}
		try {
			await client.mutate<DeletePostMutationResult, DeletePostMutationVariables>({
				mutation: DELETE_POST,
				variables: { id: postId }
			});

			toastStore.success('Post deleted successfully');
			goto('/posts');
		} catch (error) {
			console.error('Error deleting post:', error);
			toastStore.error('Failed to delete post');
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<div class="space-y-6">
	{#if loading}
		<div class="text-center py-12">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"
			></div>
			<p class="mt-2 text-text-subdued">Loading post...</p>
		</div>
	{:else}
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-text">Edit Post</h1>
				<p class="mt-2 text-text-subdued">Update post information</p>
			</div>
			<div class="flex gap-3">
				<Button variant="critical" onclick={() => (deleteModalOpen = true)}>Delete</Button>
				<Button variant="secondary" onclick={() => goto('/posts')}>Cancel</Button>
			</div>
		</div>

		<Card>
			<form onsubmit={handleSubmit} class="space-y-6">
				<Input
					label="Title"
					bind:value={title}
					placeholder="Enter post title"
					required
					error={errors.title}
					oninput={() => {
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
					<Button type="submit" loading={submitting} disabled={submitting}>Update Post</Button>
				</div>
			</form>
		</Card>
	{/if}
</div>

<Modal bind:open={deleteModalOpen} title="Delete Post">
	<p class="text-text">Are you sure you want to delete this post? This action cannot be undone.</p>

	{#snippet actions()}
		<Button variant="secondary" onclick={() => (deleteModalOpen = false)}>Cancel</Button>
		<Button variant="critical" onclick={handleDelete}>Delete</Button>
	{/snippet}
</Modal>
