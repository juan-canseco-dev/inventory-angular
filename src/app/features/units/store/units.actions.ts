import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Unit,
  CreateUnitRequest,
  GetUnitsRequest,
  UpdateUnitRequest
} from '../models';
import { PagedList, Error } from '../../../shared/types';

export const UnitsActions = createActionGroup({
  source: 'Units',
  events: {
    'Load Page': props<{ request: GetUnitsRequest }>(),
    'Load Page Success': props<{ page: PagedList<Unit> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Create Unit': props<{ request: CreateUnitRequest }>(),
    'Create Unit Success': props<{ unitId: number }>(),
    'Create Unit Failure': props<{ error: Error }>(),
    'Reset Create Unit State': emptyProps(),

    'Update Unit': props<{ request: UpdateUnitRequest }>(),
    'Update Unit Success': emptyProps(),
    'Update Unit Failure': props<{ error: Error }>(),
    'Reset Update Unit State': emptyProps(),

    'Delete Unit': props<{ unitId: number }>(),
    'Delete Unit Success': emptyProps(),
    'Delete Unit Failure': props<{ error: Error }>(),
    'Reset Delete Unit State': emptyProps()
  }
});
