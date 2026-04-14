import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoriesActions } from './categories.actions';
import { categoriesFeature } from './categories.reducers';
import {
  CreateCategoryRequest,
  GetCategoriesRequest,
  UpdateCategoryRequest
} from '../models';

@Injectable()
export class CategoriesFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(categoriesFeature.selectPage);
  readonly categories = this.store.selectSignal(categoriesFeature.selectCategories);
  readonly loading = this.store.selectSignal(categoriesFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(categoriesFeature.selectLoadError);
  readonly empty = this.store.selectSignal(categoriesFeature.selectIsEmpty);

  readonly createLoading = this.store.selectSignal(categoriesFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(categoriesFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(categoriesFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(categoriesFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(categoriesFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(categoriesFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(categoriesFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(categoriesFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(categoriesFeature.selectDeleteError);

  loadPage(request: GetCategoriesRequest): void {
    this.store.dispatch(CategoriesActions.loadPage({ request }));
  }

  createCategory(request: CreateCategoryRequest): void {
    this.store.dispatch(CategoriesActions.createCategory({ request }));
  }

  updateCategory(request: UpdateCategoryRequest): void {
    this.store.dispatch(CategoriesActions.updateCategory({ request }));
  }

  deleteCategory(categoryId: number): void {
    this.store.dispatch(CategoriesActions.deleteCategory({ categoryId }));
  }

  resetCreateState(): void {
    this.store.dispatch(CategoriesActions.resetCreateCategoryState());
  }

  resetUpdateState(): void {
    this.store.dispatch(CategoriesActions.resetUpdateCategoryState());
  }

  resetDeleteState(): void {
    this.store.dispatch(CategoriesActions.resetDeleteCategoryState());
  }
}
