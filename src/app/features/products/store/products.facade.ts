import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateProductRequest,
  GetProductsRequest,
  UpdateProductRequest
} from '../models';
import { ProductsActions } from './products.actions';
import { productsFeature } from './products.feature';

@Injectable({
  providedIn: 'root'
})
export class ProductsFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(productsFeature.selectPage);
  readonly products = this.store.selectSignal(productsFeature.selectProducts);
  readonly loading = this.store.selectSignal(productsFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(productsFeature.selectLoadError);
  readonly empty = this.store.selectSignal(productsFeature.selectIsEmpty);

  readonly productDetails = this.store.selectSignal(productsFeature.selectProductDetails);
  readonly productDetailsLoading = this.store.selectSignal(productsFeature.selectProductDetailsLoading);
  readonly productDetailsSuccess = this.store.selectSignal(productsFeature.selectProductDetailsSuccess);
  readonly productDetailsError = this.store.selectSignal(productsFeature.selectProductDetailsError);

  readonly createLoading = this.store.selectSignal(productsFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(productsFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(productsFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(productsFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(productsFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(productsFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(productsFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(productsFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(productsFeature.selectDeleteError);

  loadPage(request: GetProductsRequest): void {
    this.store.dispatch(ProductsActions.loadPage({ request }));
  }

  loadProductDetails(productId: number): void {
    this.store.dispatch(ProductsActions.loadProductDetails({ productId }));
  }

  createProduct(request: CreateProductRequest): void {
    this.store.dispatch(ProductsActions.createProduct({ request }));
  }

  updateProduct(request: UpdateProductRequest): void {
    this.store.dispatch(ProductsActions.updateProduct({ request }));
  }

  deleteProduct(productId: number): void {
    this.store.dispatch(ProductsActions.deleteProduct({ productId }));
  }

  resetProductDetailsState(): void {
    this.store.dispatch(ProductsActions.resetProductDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(ProductsActions.resetCreateProductState());
  }

  resetUpdateState(): void {
    this.store.dispatch(ProductsActions.resetUpdateProductState());
  }

  resetDeleteState(): void {
    this.store.dispatch(ProductsActions.resetDeleteProductState());
  }
}
