import { Address, SortDirection } from "./shared";

export interface CreateSupplierRequest {
    compayName: string;
    contactName: string;
    contactPhone: string;
    address: Address
};

export interface UpadteSupplierRequest {
    supplierId: number;
    compayName: string;
    contactName: string;
    contactPhone: string;
    address: Address
};

export interface Supplier {
    id: number;
    compayName: string;
    contactName: string;
    contactPhone: string;
};


export interface SupplierDetails {
    id: number;
    compayName: string;
    contactName: string;
    contactPhone: string;
    address: Address;
};

export interface GetSuppliersRequest {
    pageNumber: number | null;
    pageSize: number | null;
    orderBy: string | null;
    sortOrder: SortDirection | null;
    compayName: string | null;
    contactName: string | null;
    contactPhone: string | null;
};