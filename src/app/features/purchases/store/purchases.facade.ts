import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreatePurchaseRequest,
  GetPurchasesRequest,
  UpdatePurchaseRequest
} from '../models';
import { PurchasesActions } from './purchases.actions';
import { purchasesFeature } from './purchases.feature';

@Injectable({
  providedIn: 'root'
})
export class PurchasesFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(purchasesFeature.selectPage);
  readonly purchases = this.store.selectSignal(purchasesFeature.selectPurchases);
  readonly loading = this.store.selectSignal(purchasesFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(purchasesFeature.selectLoadError);
  readonly empty = this.store.selectSignal(purchasesFeature.selectIsEmpty);

  readonly purchaseDetails = this.store.selectSignal(purchasesFeature.selectPurchaseDetails);
  readonly purchaseDetailsLoading = this.store.selectSignal(purchasesFeature.selectPurchaseDetailsLoading);
  readonly purchaseDetailsSuccess = this.store.selectSignal(purchasesFeature.selectPurchaseDetailsSuccess);
  readonly purchaseDetailsError = this.store.selectSignal(purchasesFeature.selectPurchaseDetailsError);

  readonly createLoading = this.store.selectSignal(purchasesFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(purchasesFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(purchasesFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(purchasesFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(purchasesFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(purchasesFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(purchasesFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(purchasesFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(purchasesFeature.selectDeleteError);

  loadPage(request: GetPurchasesRequest): void {
    this.store.dispatch(PurchasesActions.loadPage({ request }));
  }

  loadPurchaseDetails(purchaseId: number): void {
    this.store.dispatch(PurchasesActions.loadPurchaseDetails({ purchaseId }));
  }

  createPurchase(request: CreatePurchaseRequest): void {
    this.store.dispatch(PurchasesActions.createPurchase({ request }));
  }

  updatePurchase(request: UpdatePurchaseRequest): void {
    this.store.dispatch(PurchasesActions.updatePurchase({ request }));
  }

  deletePurchase(purchaseId: number): void {
    this.store.dispatch(PurchasesActions.deletePurchase({ purchaseId }));
  }

  resetPurchaseDetailsState(): void {
    this.store.dispatch(PurchasesActions.resetPurchaseDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(PurchasesActions.resetCreatePurchaseState());
  }

  resetUpdateState(): void {
    this.store.dispatch(PurchasesActions.resetUpdatePurchaseState());
  }

  resetDeleteState(): void {
    this.store.dispatch(PurchasesActions.resetDeletePurchaseState());
  }
}
