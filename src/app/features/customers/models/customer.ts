import { Address } from '../../../shared/types';

export interface Customer {
  id: number;
  dni: string;
  phone: string;
  fullName: string;
};

export interface CustomerDetails {
  id: number;
  dni: string;
  phone: string;
  fullName: string;
  address: Address;
};
