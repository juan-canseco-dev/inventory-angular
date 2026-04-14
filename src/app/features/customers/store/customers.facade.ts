import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { customersFeature } from './customers.feature';
import { CustomersActions } from './customers.actions';
import {
  CreateCustomerRequest,
  GetCustomersRequest,
  UpdateCustomerRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomersFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(customersFeature.selectPage);
  readonly customers = this.store.selectSignal(customersFeature.selectCustomers);
  readonly loading = this.store.selectSignal(customersFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(customersFeature.selectLoadError);
  readonly empty = this.store.selectSignal(customersFeature.selectIsEmpty);

  readonly customerDetails = this.store.selectSignal(customersFeature.selectCustomerDetails);
  readonly customerDetailsLoading = this.store.selectSignal(customersFeature.selectCustomerDetailsLoading);
  readonly customerDetailsSuccess = this.store.selectSignal(customersFeature.selectCustomerDetailsSuccess);
  readonly customerDetailsError = this.store.selectSignal(customersFeature.selectCustomerDetailsError);

  readonly createLoading = this.store.selectSignal(customersFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(customersFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(customersFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(customersFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(customersFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(customersFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(customersFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(customersFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(customersFeature.selectDeleteError);

  loadPage(request: GetCustomersRequest): void {
    this.store.dispatch(CustomersActions.loadPage({ request }));
  }

  loadCustomerDetails(customerId: number): void {
    this.store.dispatch(CustomersActions.loadCustomerDetails({ customerId }));
  }

  createCustomer(request: CreateCustomerRequest): void {
    this.store.dispatch(CustomersActions.createCustomer({ request }));
  }

  updateCustomer(request: UpdateCustomerRequest): void {
    this.store.dispatch(CustomersActions.updateCustomer({ request }));
  }

  deleteCustomer(customerId: number): void {
    this.store.dispatch(CustomersActions.deleteCustomer({ customerId }));
  }

  resetCustomerDetailsState(): void {
    this.store.dispatch(CustomersActions.resetCustomerDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(CustomersActions.resetCreateCustomerState());
  }

  resetUpdateState(): void {
    this.store.dispatch(CustomersActions.resetUpdateCustomerState());
  }

  resetDeleteState(): void {
    this.store.dispatch(CustomersActions.resetDeleteCustomerState());
  }
}
