import { SortDirection } from '../../../shared/types';

export interface GetCustomersRequest {
  pageNumber: number | null;
  pageSize: number | null;
  orderBy: string | null;
  sortOrder: SortDirection | null;
  dni: string | null;
  fullName: string | null;
  phone: string | null;
};
