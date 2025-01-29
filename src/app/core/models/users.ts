import { RoleDetails } from "./role";

export interface CreateUserRequest {
    fullName: string;
    roleId: number;
    email: string;
    password: string;
};

export interface ChangeUserRoleRequest {
    userId: number;
    roleId: number;
};

export interface UpdateUserRequest {
    userId: number;
    fullName: string;
};


export interface GetUsersRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: string | null;
    fullName: string | null;
    email: string | null;
};

export interface User {
    id: number;
    role: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date | null;
};


export interface UserDetails {
    id: number;
    role: RoleDetails;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date | null;
};

