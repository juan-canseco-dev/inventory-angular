export interface GetUsersRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: string | null;
    fullName: string | null;
    email: string | null;
};
