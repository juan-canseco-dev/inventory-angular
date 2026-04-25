import { Error, MutationState, PagedList, RequestStatus } from '../../../shared/types';
import { GetPurchasesRequest, Purchase, PurchaseDetails } from '../models';

export interface PurchasesState {
  page: PagedList<Purchase> | null;
  request: GetPurchasesRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: PurchaseDetails | null;
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

export const initialPurchasesRequest: GetPurchasesRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  supplierId: null,
  arrived: null,
  orderedAtStartDate: null,
  orderedAtEndDate: null,
  arrivedAtStartDate: null,
  arrivedAtEndDate: null
};

export const initialPurchasesState: PurchasesState = {
  page: null,
  request: initialPurchasesRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
