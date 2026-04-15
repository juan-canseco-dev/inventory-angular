import { Error, RequestStatus } from '../../types';
import { LookupOption } from '../models';

export interface AutocompleteSliceState {
  items: LookupOption[];
  query: string;
  status: RequestStatus;
  error: Error | null;
  loadedAt: string | null;
}

export interface AutocompleteState {
  categories: AutocompleteSliceState;
  roles: AutocompleteSliceState;
  suppliers: AutocompleteSliceState;
  units: AutocompleteSliceState;
}

export const initialAutocompleteSliceState: AutocompleteSliceState = {
  items: [],
  query: '',
  status: 'idle',
  error: null,
  loadedAt: null
};

export const initialAutocompleteState: AutocompleteState = {
  categories: initialAutocompleteSliceState,
  roles: initialAutocompleteSliceState,
  suppliers: initialAutocompleteSliceState,
  units: initialAutocompleteSliceState
};
