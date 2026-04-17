import { SortDirection } from '../../../shared/types';

export interface GetProductsRequest {
  pageNumber: number | null;
  pageSize: number | null;
  orderBy: string | null;
  sortOrder: SortDirection | null;
  name: string | null;
  supplierId: number | null;
  categoryId: number | null;
  unitId: number | null;
}
