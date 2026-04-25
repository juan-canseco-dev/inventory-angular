import { SortDirection } from '../../../shared/types';

export interface GetPurchasesRequest {
  pageNumber: number | null;
  pageSize: number | null;
  orderBy: string | null;
  sortOrder: SortDirection | null;
  supplierId: number | null;
  arrived: boolean | null;
  orderedAtStartDate: Date | null;
  orderedAtEndDate: Date | null;
  arrivedAtStartDate: Date | null;
  arrivedAtEndDate: Date | null;
};
