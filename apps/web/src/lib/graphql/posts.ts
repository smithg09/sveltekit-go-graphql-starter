import { gql } from '@apollo/client/core';
import type { Post, CreatePostDto, UpdatePostDto, WherePostsDto } from './types';

// Queries

export const LIST_POSTS = gql`
	query ListPosts($where: WherePostsDto) {
		listPosts(where: $where) {
			id
			title
			slug
			status
			content
			created_at
			updated_at
			category {
				id
				name
				slug
				status
			}
		}
	}
`;

export const GET_POST = gql`
	query GetPost($id: Uuid!) {
		getPost(id: $id) {
			id
			title
			slug
			status
			content
			created_at
			updated_at
			category {
				id
				name
				slug
				status
			}
		}
	}
`;

// Mutations

export const CREATE_POST = gql`
	mutation CreatePost($data: CreatePostDto!) {
		createPost(data: $data) {
			id
			title
			slug
			status
			content
			created_at
			updated_at
			category {
				id
				name
				slug
				status
			}
		}
	}
`;

export const UPDATE_POST = gql`
	mutation UpdatePost($id: Uuid!, $data: UpdatePostDto!) {
		updatePost(id: $id, data: $data) {
			id
			title
			slug
			status
			content
			created_at
			updated_at
			category {
				id
				name
				slug
				status
			}
		}
	}
`;

export const DELETE_POST = gql`
	mutation DeletePost($id: Uuid!) {
		deletePost(id: $id)
	}
`;

// Types for query/mutation results

export interface ListPostsQueryResult {
	listPosts: Post[];
}

export interface ListPostsQueryVariables {
	where?: WherePostsDto | null;
}

export interface GetPostQueryResult {
	getPost: Post | null;
}

export interface GetPostQueryVariables {
	id: string;
}

export interface CreatePostMutationResult {
	createPost: Post | null;
}

export interface CreatePostMutationVariables {
	data: CreatePostDto;
}

export interface UpdatePostMutationResult {
	updatePost: Post | null;
}

export interface UpdatePostMutationVariables {
	id: string;
	data: UpdatePostDto;
}

export interface DeletePostMutationResult {
	deletePost: boolean | null;
}

export interface DeletePostMutationVariables {
	id: string;
}
