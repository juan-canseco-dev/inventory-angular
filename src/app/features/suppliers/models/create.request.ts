import { Address } from '../../../shared/types';
export interface CreateSupplierRequest {
    companyName: string;
    contactName: string;
    contactPhone: string;
    address: Address
};
