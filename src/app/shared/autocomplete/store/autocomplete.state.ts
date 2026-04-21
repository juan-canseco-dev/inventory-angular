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
  customers: AutocompleteSliceState;
  categories: AutocompleteSliceState;
  roles: AutocompleteSliceState;
  products: AutocompleteSliceState;
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
  customers: initialAutocompleteSliceState,
  categories: initialAutocompleteSliceState,
  roles: initialAutocompleteSliceState,
  products: initialAutocompleteSliceState,
  suppliers: initialAutocompleteSliceState,
  units: initialAutocompleteSliceState
};
