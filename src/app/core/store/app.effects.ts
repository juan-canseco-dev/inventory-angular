import { AuthEffects } from '../auth/store';
import { RoleEffects } from '../../features/roles/store';
import { SupplierEffects } from '../../features/suppliers/store';
import { CategoriesEffects } from '../../features/categories/store';
import { UnitsEffects } from '../../features/units/store';
import { CustomersEffects } from '../../features/customers/store';


export const ROOT_EFFECTS = [
  AuthEffects,
  CategoriesEffects,
  UnitsEffects,
  SupplierEffects,
  CustomersEffects,
  RoleEffects
];
