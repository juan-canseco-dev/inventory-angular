import { Address } from '../../../shared/types';

export interface UpdateCustomerRequest {
  customerId: number;
  dni: string;
  phone: string;
  fullName: string;
  address: Address;
};
