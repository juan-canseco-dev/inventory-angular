import { MutationState, Error, PagedList, RequestStatus } from '../../../shared/types';
import { GetProductsRequest, Product, ProductDetails } from '../models';

export interface ProductsState {
  page: PagedList<Product> | null;
  request: GetProductsRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: ProductDetails | null;
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

export const initialProductsRequest: GetProductsRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  name: null,
  supplierId: null,
  categoryId: null,
  unitId: null
};

export const initialProductsState: ProductsState = {
  page: null,
  request: initialProductsRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
