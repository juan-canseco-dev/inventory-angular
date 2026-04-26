import { Error, RequestStatus } from '../../../shared/types';
import { DashboardData, DashboardRequest } from '../models';

export interface DashboardState {
  data: DashboardData | null;
  request: DashboardRequest;
  loadStatus: RequestStatus;
  loadError: Error | null;
  lastUpdatedAt: Date | null;
}

const now = new Date();

export const initialDashboardRequest: DashboardRequest = {
  startDate: new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0),
  endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
  limit: 5,
  stockThreshold: 10
};

export const initialDashboardState: DashboardState = {
  data: null,
  request: initialDashboardRequest,
  loadStatus: 'idle',
  loadError: null,
  lastUpdatedAt: null
};
