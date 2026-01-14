// GraphQL Types based on schema introspection

export enum CategoryStatusEnum {
	ACTIVE = 'ACTIVE',
	PENDING = 'PENDING',
	ARCHIVED = 'ARCHIVED'
}

export enum PostStatusEnum {
	ACTIVE = 'ACTIVE',
	PENDING = 'PENDING',
	ARCHIVED = 'ARCHIVED'
}

export enum SortOrder {
	ASC = 'asc',
	DESC = 'desc'
}

export interface Category {
	id: string;
	name: string;
	slug: string | null;
	status: CategoryStatusEnum;
	created_at: string;
	updated_at: string;
}

export interface Post {
	id: string;
	title: string;
	slug: string;
	category: Category;
	status: PostStatusEnum;
	content: string | null;
	created_at: string;
	updated_at: string;
}

export interface CreateCategoryDto {
	name: string;
	slug?: string | null;
	status?: CategoryStatusEnum | null;
}

export interface UpdateCategoryDto {
	name?: string | null;
	slug?: string | null;
	status?: CategoryStatusEnum | null;
}

export interface CreatePostDto {
	title: string;
	slug?: string | null;
	status: PostStatusEnum;
	category: string; // UUID
	content?: string | null;
}

export interface UpdatePostDto {
	title?: string | null;
	slug?: string | null;
	category?: string | null; // UUID
	status?: PostStatusEnum | null;
	content?: string | null;
}

export interface StringFilter {
	eq?: string | null;
	regex?: string | null;
}

export interface UuidFilter {
	eq?: string | null;
	in?: string[] | null;
}

export interface SortFilter {
	sortBy?: string | null;
	sortOrder?: SortOrder | null;
}

export interface PaginationFilter {
	limit?: number | null;
	skip?: number | null;
}

export interface WhereCategoriesDto {
	name?: StringFilter | null;
	slug?: StringFilter | null;
	status?: CategoryStatusEnum | null;
	sort?: SortFilter | null;
	pagination?: PaginationFilter | null;
}

export interface WherePostsDto {
	title?: StringFilter | null;
	slug?: StringFilter | null;
	category?: UuidFilter | null;
	status?: PostStatusEnum | null;
	sort?: SortFilter | null;
	pagination?: PaginationFilter | null;
}
