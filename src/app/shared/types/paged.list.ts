export interface PagedList<T> {
    items: T[] | null;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasPreviousPage:  boolean;
    hasNextPage: boolean;
  };
