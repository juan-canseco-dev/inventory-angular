export interface PagedList<T> {
    items: T[] | null;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasPreviousPage:  boolean;
    hasNextPage: boolean;
  }

  export interface Address {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    street: string;
  }

  export type SortDirection = 'asc' | 'desc' | '';