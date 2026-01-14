import { gql } from '@apollo/client/core';
import type { Category, CreateCategoryDto, UpdateCategoryDto, WhereCategoriesDto } from './types';

// Queries

export const LIST_CATEGORIES = gql`
	query ListCategories($where: WhereCategoriesDto) {
		listCategories(where: $where) {
			id
			name
			slug
			status
			created_at
			updated_at
		}
	}
`;

export const GET_CATEGORY = gql`
	query GetCategory($id: Uuid!) {
		getCategory(id: $id) {
			id
			name
			slug
			status
			created_at
			updated_at
		}
	}
`;

// Mutations

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($data: CreateCategoryDto!) {
		createCategory(data: $data) {
			id
			name
			slug
			status
			created_at
			updated_at
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($id: Uuid!, $data: UpdateCategoryDto!) {
		updateCategory(id: $id, data: $data) {
			id
			name
			slug
			status
			created_at
			updated_at
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: Uuid!) {
		deleteCategory(id: $id)
	}
`;

// Types for query/mutation results

export interface ListCategoriesQueryResult {
	listCategories: Category[];
}

export interface ListCategoriesQueryVariables {
	where?: WhereCategoriesDto | null;
}

export interface GetCategoryQueryResult {
	getCategory: Category | null;
}

export interface GetCategoryQueryVariables {
	id: string;
}

export interface CreateCategoryMutationResult {
	createCategory: Category | null;
}

export interface CreateCategoryMutationVariables {
	data: CreateCategoryDto;
}

export interface UpdateCategoryMutationResult {
	updateCategory: Category | null;
}

export interface UpdateCategoryMutationVariables {
	id: string;
	data: UpdateCategoryDto;
}

export interface DeleteCategoryMutationResult {
	deleteCategory: boolean | null;
}

export interface DeleteCategoryMutationVariables {
	id: string;
}
