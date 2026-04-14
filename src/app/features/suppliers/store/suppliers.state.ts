import { Supplier, SupplierDetails, GetSuppliersRequest } from '../models';
import { PagedList, Error, RequestStatus, MutationState } from '../../../shared/types';

export interface SuppliersState {

  page: PagedList<Supplier> | null;
  request: GetSuppliersRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: SupplierDetails | null;
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

export const initialSuppliersRequest: GetSuppliersRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  compayName: null,
  contactName: null,
  contactPhone: null
};

export const initialSuppliersState: SuppliersState = {
  page: null,
  request: initialSuppliersRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
