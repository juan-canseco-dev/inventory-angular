export interface CreateRoleRequest {
    name: string;
    permissions: string[];
};

export interface UpdateRoleRequest {
    roleId: number;
    name: string;
    permissions: string[];
};

export interface GetRolesRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: string | null;
    name: string | null;
};

export interface Role {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string | null;
};

export interface RoleDetails {
    id: number;
    name: string;
    permissions: string;
    createdAt: Date;
    updatedAt: Date | null;
};