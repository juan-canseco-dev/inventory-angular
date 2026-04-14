import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Supplier,
  SupplierDetails,
  CreateSupplierRequest,
  GetSuppliersRequest,
  UpdateSupplierRequest
} from '../models';
import { PagedList, Error } from '../../../shared/types';

export const SuppliersActions = createActionGroup({
  source: 'Suppliers',
  events: {
    'Load Page': props<{ request: GetSuppliersRequest }>(),
    'Load Page Success': props<{ page: PagedList<Supplier> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Supplier Details': props<{ supplierId: number }>(),
    'Load Supplier Details Success': props<{ details: SupplierDetails }>(),
    'Load Supplier Details Failure': props<{ error: Error }>(),
    'Reset Supplier Details State': emptyProps(),

    'Create Supplier': props<{ request: CreateSupplierRequest }>(),
    'Create Supplier Success': props<{ supplierId: number }>(),
    'Create Supplier Failure': props<{ error: Error }>(),
    'Reset Create Supplier State': emptyProps(),

    'Update Supplier': props<{ request: UpdateSupplierRequest }>(),
    'Update Supplier Success': emptyProps(),
    'Update Supplier Failure': props<{ error: Error }>(),
    'Reset Update Supplier State': emptyProps(),

    'Delete Supplier': props<{ supplierId: number }>(),
    'Delete Supplier Success': emptyProps(),
    'Delete Supplier Failure': props<{ error: Error }>(),
    'Reset Delete Supplier State': emptyProps()
  }
});
