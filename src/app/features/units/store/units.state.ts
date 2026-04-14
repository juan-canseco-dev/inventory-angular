import { Unit, GetUnitsRequest } from '../models';
import { Error } from '../../../shared/types/api.errors';
import { PagedList, RequestStatus, MutationState } from '../../../shared/types';

export interface UnitsState {
  page: PagedList<Unit> | null;
  request: GetUnitsRequest;
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

export const initialUnitsRequest: GetUnitsRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  name: null
};

export const initialUnitsState: UnitsState = {
  page: null,
  request: initialUnitsRequest,
  loadStatus: 'idle',
  loadError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
