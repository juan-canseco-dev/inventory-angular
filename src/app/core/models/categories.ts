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
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null; 
    sortOrder: string | null;
    name: string | null;
}