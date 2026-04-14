import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Customer,
  CustomerDetails,
  CreateCustomerRequest,
  GetCustomersRequest,
  UpdateCustomerRequest
} from '../models';
import { Error, PagedList } from '../../../shared/types';

export const CustomersActions = createActionGroup({
  source: 'Customers',
  events: {
    'Load Page': props<{ request: GetCustomersRequest }>(),
    'Load Page Success': props<{ page: PagedList<Customer> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Customer Details': props<{ customerId: number }>(),
    'Load Customer Details Success': props<{ details: CustomerDetails }>(),
    'Load Customer Details Failure': props<{ error: Error }>(),
    'Reset Customer Details State': emptyProps(),

    'Create Customer': props<{ request: CreateCustomerRequest }>(),
    'Create Customer Success': props<{ customerId: number }>(),
    'Create Customer Failure': props<{ error: Error }>(),
    'Reset Create Customer State': emptyProps(),

    'Update Customer': props<{ request: UpdateCustomerRequest }>(),
    'Update Customer Success': emptyProps(),
    'Update Customer Failure': props<{ error: Error }>(),
    'Reset Update Customer State': emptyProps(),

    'Delete Customer': props<{ customerId: number }>(),
    'Delete Customer Success': emptyProps(),
    'Delete Customer Failure': props<{ error: Error }>(),
    'Reset Delete Customer State': emptyProps()
  }
});
