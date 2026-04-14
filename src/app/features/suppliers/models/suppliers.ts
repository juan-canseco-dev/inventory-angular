import { Address } from '../../../shared/types';

export interface Supplier {
    id: number;
    companyName: string;
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
