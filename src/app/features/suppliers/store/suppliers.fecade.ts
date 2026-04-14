import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SuppliersActions } from './suppliers.actions';
import { suppliersFeature } from './suppliers.reducers';
import {
  CreateSupplierRequest,
  GetSuppliersRequest,
  UpdateSupplierRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SuppliersFecade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(suppliersFeature.selectPage);
  readonly suppliers = this.store.selectSignal(suppliersFeature.selectSuppliers);
  readonly loading = this.store.selectSignal(suppliersFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(suppliersFeature.selectLoadError);
  readonly empty = this.store.selectSignal(suppliersFeature.selectIsEmpty);


  readonly supplierDetails = this.store.selectSignal(suppliersFeature.selectSupplierDetails);
  readonly supplierDetailsLoading = this.store.selectSignal(suppliersFeature.selectSupplierDetailsLoading);
  readonly supplierDetailsSuccess = this.store.selectSignal(suppliersFeature.selectSupplierDetailsSuccess);
  readonly supplierDetailsError = this.store.selectSignal(suppliersFeature.selectSupplierDetailsError);


  readonly createLoading = this.store.selectSignal(suppliersFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(suppliersFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(suppliersFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(suppliersFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(suppliersFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(suppliersFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(suppliersFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(suppliersFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(suppliersFeature.selectDeleteError);

  loadPage(request: GetSuppliersRequest): void {
    this.store.dispatch(SuppliersActions.loadPage({ request }));
  }

   loadSupplierDetails(supplierId: number): void {
    this.store.dispatch(SuppliersActions.loadSupplierDetails({ supplierId }));
  }

  createSupplier(request: CreateSupplierRequest): void {
    this.store.dispatch(SuppliersActions.createSupplier({ request }));
  }

  updateSupplier(request: UpdateSupplierRequest): void {
    this.store.dispatch(SuppliersActions.updateSupplier({ request }));
  }

  deleteSupplier(supplierId: number): void {
    this.store.dispatch(SuppliersActions.deleteSupplier({ supplierId }));
  }

  resetSupplierDetailsState(): void {
    this.store.dispatch(SuppliersActions.resetSupplierDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(SuppliersActions.resetCreateSupplierState());
  }

  resetUpdateState(): void {
    this.store.dispatch(SuppliersActions.resetUpdateSupplierState());
  }

  resetDeleteState(): void {
    this.store.dispatch(SuppliersActions.resetDeleteSupplierState());
  }

}
