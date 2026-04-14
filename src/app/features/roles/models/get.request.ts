import { SortDirection } from '../../../shared/types';
export interface GetRolesRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: SortDirection | null;
    name: string | null;
};
