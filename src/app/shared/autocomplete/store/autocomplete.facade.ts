import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutocompleteActions } from './autocomplete.actions';
import { autocompleteFeature } from './autocomplete.feature';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteFacade {
  private readonly store = inject(Store);

  readonly customerOptions = this.store.selectSignal(autocompleteFeature.selectCustomerOptions);
  readonly customerOptionsQuery = this.store.selectSignal(autocompleteFeature.selectCustomerOptionsQuery);
  readonly customerOptionsLoading = this.store.selectSignal(autocompleteFeature.selectCustomerOptionsLoading);
  readonly customerOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectCustomerOptionsLoaded);
  readonly customerOptionsError = this.store.selectSignal(autocompleteFeature.selectCustomerOptionsError);
  readonly customerOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectCustomerOptionsLoadedAt);

  readonly categoryOptions = this.store.selectSignal(autocompleteFeature.selectCategoryOptions);
  readonly categoryOptionsQuery = this.store.selectSignal(autocompleteFeature.selectCategoryOptionsQuery);
  readonly categoryOptionsLoading = this.store.selectSignal(autocompleteFeature.selectCategoryOptionsLoading);
  readonly categoryOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectCategoryOptionsLoaded);
  readonly categoryOptionsError = this.store.selectSignal(autocompleteFeature.selectCategoryOptionsError);
  readonly categoryOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectCategoryOptionsLoadedAt);

  readonly roleOptions = this.store.selectSignal(autocompleteFeature.selectRoleOptions);
  readonly roleOptionsQuery = this.store.selectSignal(autocompleteFeature.selectRoleOptionsQuery);
  readonly roleOptionsLoading = this.store.selectSignal(autocompleteFeature.selectRoleOptionsLoading);
  readonly roleOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectRoleOptionsLoaded);
  readonly roleOptionsError = this.store.selectSignal(autocompleteFeature.selectRoleOptionsError);
  readonly roleOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectRoleOptionsLoadedAt);

  readonly productOptions = this.store.selectSignal(autocompleteFeature.selectProductOptions);
  readonly productOptionsQuery = this.store.selectSignal(autocompleteFeature.selectProductOptionsQuery);
  readonly productOptionsLoading = this.store.selectSignal(autocompleteFeature.selectProductOptionsLoading);
  readonly productOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectProductOptionsLoaded);
  readonly productOptionsError = this.store.selectSignal(autocompleteFeature.selectProductOptionsError);
  readonly productOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectProductOptionsLoadedAt);

  readonly supplierOptions = this.store.selectSignal(autocompleteFeature.selectSupplierOptions);
  readonly supplierOptionsQuery = this.store.selectSignal(autocompleteFeature.selectSupplierOptionsQuery);
  readonly supplierOptionsLoading = this.store.selectSignal(autocompleteFeature.selectSupplierOptionsLoading);
  readonly supplierOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectSupplierOptionsLoaded);
  readonly supplierOptionsError = this.store.selectSignal(autocompleteFeature.selectSupplierOptionsError);
  readonly supplierOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectSupplierOptionsLoadedAt);

  readonly unitOptions = this.store.selectSignal(autocompleteFeature.selectUnitOptions);
  readonly unitOptionsQuery = this.store.selectSignal(autocompleteFeature.selectUnitOptionsQuery);
  readonly unitOptionsLoading = this.store.selectSignal(autocompleteFeature.selectUnitOptionsLoading);
  readonly unitOptionsLoaded = this.store.selectSignal(autocompleteFeature.selectUnitOptionsLoaded);
  readonly unitOptionsError = this.store.selectSignal(autocompleteFeature.selectUnitOptionsError);
  readonly unitOptionsLoadedAt = this.store.selectSignal(autocompleteFeature.selectUnitOptionsLoadedAt);

  loadCustomerOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadCustomerOptions({ query }));
  }

  searchCustomers(query: string): void {
    this.loadCustomerOptions(query);
  }

  clearCustomerOptions(): void {
    this.store.dispatch(AutocompleteActions.clearCustomerOptions());
  }

  loadCategoryOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadCategoryOptions({ query }));
  }

  searchCategories(query: string): void {
    this.loadCategoryOptions(query);
  }

  clearCategoryOptions(): void {
    this.store.dispatch(AutocompleteActions.clearCategoryOptions());
  }

  loadRoleOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadRoleOptions({ query }));
  }

  searchRoles(query: string): void {
    this.loadRoleOptions(query);
  }

  clearRoleOptions(): void {
    this.store.dispatch(AutocompleteActions.clearRoleOptions());
  }

  loadProductOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadProductOptions({ query }));
  }

  searchProducts(query: string): void {
    this.loadProductOptions(query);
  }

  clearProductOptions(): void {
    this.store.dispatch(AutocompleteActions.clearProductOptions());
  }

  loadSupplierOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadSupplierOptions({ query }));
  }

  searchSuppliers(query: string): void {
    this.loadSupplierOptions(query);
  }

  clearSupplierOptions(): void {
    this.store.dispatch(AutocompleteActions.clearSupplierOptions());
  }

  loadUnitOptions(query = ''): void {
    this.store.dispatch(AutocompleteActions.loadUnitOptions({ query }));
  }

  searchUnits(query: string): void {
    this.loadUnitOptions(query);
  }

  clearUnitOptions(): void {
    this.store.dispatch(AutocompleteActions.clearUnitOptions());
  }
}
