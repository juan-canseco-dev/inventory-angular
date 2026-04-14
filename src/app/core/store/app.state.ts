import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authFeature } from '../auth/store';
import { categoriesFeature, CategoriesState} from '../../features/categories/store';
import { customersFeature, CustomersState } from '../../features/customers/store';
import { RolesState, rolesFeature } from '../../features/roles/store';
import { UnitsState, unitsFeature } from '../../features/units/store';
import { suppliersFeature, SuppliersState  } from '../../features/suppliers/store';

export interface AppState {
  auth: AuthState;
  categories: CategoriesState;
  units: UnitsState;
  suppliers: SuppliersState;
  customers: CustomersState;
  roles: RolesState;
};

export const ROOT_REDUCERS : ActionReducerMap<AppState> = {
  auth: authFeature.reducer,
  categories: categoriesFeature.reducer,
  units: unitsFeature.reducer,
  suppliers: suppliersFeature.reducer,
  customers: customersFeature.reducer,
  roles: rolesFeature.reducer
};

