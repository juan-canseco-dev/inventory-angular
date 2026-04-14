import { PagedList, SortDirection, Error, RequestStatus, MutationState } from '../../../shared/types';
import {
  GetRolesRequest,
  Role,
  RoleDetails,
} from '../models';
import { PermissionResourceGroup } from '../../../core/permissions';

export interface RolesState {
  page: PagedList<Role> | null;
  request: GetRolesRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;

  details: RoleDetails | null;
  detailsStatus: RequestStatus;
  detailsError: Error | null;

  permissionGroups: PermissionResourceGroup[];
  permissionGroupsStatus: RequestStatus;
  permissionGroupsError: Error | null;

  create: MutationState;
  update: MutationState;
  delete: MutationState;
}

export const initialMutationState: MutationState = {
  status: 'idle',
  error: null
};

export const initialRolesRequest: GetRolesRequest = {
  pageNumber: 1,
  pageSize: 10,
  orderBy: 'id',
  sortOrder: 'asc' as SortDirection,
  name: null
};

export const initialRolesState: RolesState = {
  page: null,
  request: initialRolesRequest,
  loadStatus: 'idle',
  loadError: null,

  details: null,
  detailsStatus: 'idle',
  detailsError: null,

  permissionGroups: [],
  permissionGroupsStatus: 'idle',
  permissionGroupsError: null,

  create: initialMutationState,
  update: initialMutationState,
  delete: initialMutationState
};
