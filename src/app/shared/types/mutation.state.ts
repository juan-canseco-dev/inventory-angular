import { Error } from './api.errors';
import { RequestStatus } from './request.status';

export interface MutationState {
  status: RequestStatus;
  error: Error | null;
};
