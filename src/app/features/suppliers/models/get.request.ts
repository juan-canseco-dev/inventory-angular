import { SortDirection } from '../../../shared/types';

export interface GetSuppliersRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: SortDirection | null;
    compayName: string | null;
    contactName: string | null;
    contactPhone: string | null;
};
