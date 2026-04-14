import {
  Customer,
  CustomerDetails,
  GetCustomersRequest
} from '../models';
import { Error, PagedList, RequestStatus, MutationState } from '../../../shared/types';


export interface CustomersState {
  page: PagedList<Customer> | null;
  request: GetCustomersRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: CustomerDetails | null;
  detailsStatus: RequestStatus;
  detailsError: Error | null;

  create: MutationState;
  update: MutationState;
  delete: MutationState;
}

export const initialMutationState: MutationState = {
  status: 'idle',
  error: null
};

export const initialCustomersRequest: GetCustomersRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  dni: null,
  fullName: null,
  phone: null
};

export const initialCustomersState: CustomersState = {
  page: null,
  request: initialCustomersRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
