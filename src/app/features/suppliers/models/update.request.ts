import { Address } from "../../../shared/types";

export interface UpdateSupplierRequest {
    supplierId: number;
    companyName: string;
    contactName: string;
    contactPhone: string;
    address: Address
};
