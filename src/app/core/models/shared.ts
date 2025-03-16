export class PagedList<T> {
    items: T[] | null | undefined;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    hasPreviousPage:  boolean;
    hasNextPage: boolean; 

    empty() : boolean {
        return !this.items || this.items.length === 0;
    }
  }

  export interface Address {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    street: string;
  }