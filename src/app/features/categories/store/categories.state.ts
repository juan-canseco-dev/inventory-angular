import { Category, GetCategoriesRequest } from '../models';
import { Error, PagedList, RequestStatus, MutationState } from '../../../shared/types';

export interface CategoriesState {
  page: PagedList<Category> | null;
  request: GetCategoriesRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  create: MutationState;
  update: MutationState;
  delete: MutationState;
}

export const initialMutationState: MutationState = {
  status: 'idle',
  error: null
};

export const initialCategoriesRequest: GetCategoriesRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  name: null
};

export const initialCategoriesState: CategoriesState = {
  page: null,
  request: initialCategoriesRequest,
  loadStatus: 'idle',
  loadError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
