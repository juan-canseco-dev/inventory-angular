import { Address } from '../../../shared/types';

export interface CreateCustomerRequest {
  dni: string;
  phone: string;
  fullName: string;
  address: Address;
};
