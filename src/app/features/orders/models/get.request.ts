import { SortDirection } from './../../../shared/types/sort.direction';
export interface GetOrdersRequest {
  pageNumber: number | null;
  pageSize: number | null;
  orderBy: string | null;
  sortOrder: SortDirection | null;
  customerId: number | null;
  delivered: boolean | null;
  orderedAtStartDate: Date | null;
  orderedAtEndDate: Date | null;
  deliveredAtStartDate: Date | null;
  deliveredAtEndDate: Date | null;
};
