import { Error, MutationState, PagedList, RequestStatus } from '../../../shared/types';
import { GetUsersRequest, User, UserWithDetails } from '../models';

export interface UsersState {
  page: PagedList<User> | null;
  request: GetUsersRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: UserWithDetails | null;
  detailsStatus: RequestStatus;
  detailsError: Error | null;

  create: MutationState;
  update: MutationState;
  changeRole: MutationState;
  delete: MutationState;
}

export const initialMutationState: MutationState = {
  status: 'idle',
  error: null
};

export const initialUsersRequest: GetUsersRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc',
  fullName: null,
  email: null
};

export const initialUsersState: UsersState = {
  page: null,
  request: initialUsersRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  create: initialMutationState,
  update: initialMutationState,
  changeRole: initialMutationState,
  delete: initialMutationState
};
