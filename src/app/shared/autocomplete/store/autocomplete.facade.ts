import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutocompleteActions } from './autocomplete.actions';
import { autocompleteFeature } from './autocomplete.feature';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteFacade {
  private readonly store = inject(Store);

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
