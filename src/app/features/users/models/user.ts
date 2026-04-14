export interface User {
    id: number;
    role: string;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date | null;
};

export interface UserWithDetails {
    id: number;
    role: RoleDetails;
    email: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date | null;
};

export interface RoleDetails {
    id: number;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date | null;
};
