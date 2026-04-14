export interface Role {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string | null;
};

export interface RoleDetails {
    id: number;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date | null;
};
