export interface CreateCategoryRequest {
    name: string;
}

export interface UpdateCategoryRequest {
    categoryId: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface GetCategoriesRequest {
    pageNumber: number | null | undefined;
    pageSize: number | null | undefined;
    orderBy: string | null | undefined; 
    sortOrder: string | null | undefined;
    name: string | null | undefined;
}