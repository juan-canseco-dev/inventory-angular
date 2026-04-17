import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authFeature } from '../auth/store';
import { categoriesFeature, CategoriesState} from '../../features/categories/store';
import { customersFeature, CustomersState } from '../../features/customers/store';
import { RolesState, rolesFeature } from '../../features/roles/store';
import { usersFeature, UsersState } from '../../features/users/store';
import { autocompleteFeature, AutocompleteState } from '../../shared/autocomplete';
import { UnitsState, unitsFeature } from '../../features/units/store';
import { suppliersFeature, SuppliersState  } from '../../features/suppliers/store';
import { ProductsState, productsFeature } from '../../features/products/store';

export interface AppState {
  auth: AuthState;
  autocomplete: AutocompleteState;
  categories: CategoriesState;
  units: UnitsState;
  suppliers: SuppliersState;
  products: ProductsState;
  customers: CustomersState;
  roles: RolesState;
  users: UsersState;
};

export const ROOT_REDUCERS : ActionReducerMap<AppState> = {
  auth: authFeature.reducer,
  autocomplete: autocompleteFeature.reducer,
  categories: categoriesFeature.reducer,
  units: unitsFeature.reducer,
  suppliers: suppliersFeature.reducer,
  products: productsFeature.reducer,
  customers: customersFeature.reducer,
  roles: rolesFeature.reducer,
  users: usersFeature.reducer
};

