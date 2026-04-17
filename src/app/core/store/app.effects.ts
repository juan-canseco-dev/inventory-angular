import { AuthEffects } from '../auth/store';
import { RoleEffects } from '../../features/roles/store';
import { SupplierEffects } from '../../features/suppliers/store';
import { CategoriesEffects } from '../../features/categories/store';
import { UnitsEffects } from '../../features/units/store';
import { CustomersEffects } from '../../features/customers/store';
import { UsersEffects } from '../../features/users/store';
import { AutocompleteEffects } from '../../shared/autocomplete';
import { ProductsEffects } from '../../features/products/store';


export const ROOT_EFFECTS = [
  AuthEffects,
  AutocompleteEffects,
  CategoriesEffects,
  UnitsEffects,
  SupplierEffects,
  ProductsEffects,
  CustomersEffects,
  RoleEffects,
  UsersEffects
];
