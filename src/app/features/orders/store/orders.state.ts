import { Error, MutationState, PagedList, RequestStatus } from '../../../shared/types';
import { GetOrdersRequest, Order, OrderDetails } from '../models';

export interface OrdersState {
  page: PagedList<Order> | null;
  request: GetOrdersRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: OrderDetails | null;
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

export const initialOrdersRequest: GetOrdersRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  customerId: null,
  delivered: null,
  orderedAtStartDate: null,
  orderedAtEndDate: null,
  deliveredAtStartDate: null,
  deliveredAtEndDate: null
};

export const initialOrdersState: OrdersState = {
  page: null,
  request: initialOrdersRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
