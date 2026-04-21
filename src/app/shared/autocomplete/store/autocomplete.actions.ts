import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Error } from '../../types';
import { LookupOption } from '../models';

export const AutocompleteActions = createActionGroup({
  source: 'Autocomplete',
  events: {
    'Load Customer Options': props<{ query: string }>(),
    'Load Customer Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Customer Options Failure': props<{ query: string; error: Error }>(),
    'Clear Customer Options': emptyProps(),

    'Load Category Options': props<{ query: string }>(),
    'Load Category Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Category Options Failure': props<{ query: string; error: Error }>(),
    'Clear Category Options': emptyProps(),

    'Load Role Options': props<{ query: string }>(),
    'Load Role Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Role Options Failure': props<{ query: string; error: Error }>(),
    'Clear Role Options': emptyProps(),

    'Load Product Options': props<{ query: string }>(),
    'Load Product Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Product Options Failure': props<{ query: string; error: Error }>(),
    'Clear Product Options': emptyProps(),

    'Load Supplier Options': props<{ query: string }>(),
    'Load Supplier Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Supplier Options Failure': props<{ query: string; error: Error }>(),
    'Clear Supplier Options': emptyProps(),

    'Load Unit Options': props<{ query: string }>(),
    'Load Unit Options Success': props<{ query: string; items: LookupOption[] }>(),
    'Load Unit Options Failure': props<{ query: string; error: Error }>(),
    'Clear Unit Options': emptyProps()
  }
});
