import { SortDirection } from '../../../shared/types';

export interface GetUsersRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: SortDirection | null;
    fullName: string | null;
    email: string | null;
};
