import { SortDirection } from '../../../shared/types';

export interface GetUnitsRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: SortDirection | null;
    name: string | null;
};
