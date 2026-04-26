import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Error } from '../../../shared/types';
import { DashboardData, DashboardRequest, DashboardUpdatedMessage } from '../models';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Dashboard': props<{ request: DashboardRequest }>(),
    'Load Dashboard Success': props<{ data: DashboardData }>(),
    'Load Dashboard Failure': props<{ error: Error }>(),

    'Connect Updates': emptyProps(),
    'Disconnect Updates': emptyProps(),
    'Update Signal Received': props<{ message: DashboardUpdatedMessage }>()
  }
});
