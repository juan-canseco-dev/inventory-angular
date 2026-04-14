import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UnitsActions } from './units.actions';
import { unitsFeature } from './units.readucers';
import {
  CreateUnitRequest,
  GetUnitsRequest,
  UpdateUnitRequest
} from '../models';

@Injectable()
export class UnitsFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(unitsFeature.selectPage);
  readonly units = this.store.selectSignal(unitsFeature.selectUnits);
  readonly loading = this.store.selectSignal(unitsFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(unitsFeature.selectLoadError);
  readonly empty = this.store.selectSignal(unitsFeature.selectIsEmpty);

  readonly createLoading = this.store.selectSignal(unitsFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(unitsFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(unitsFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(unitsFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(unitsFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(unitsFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(unitsFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(unitsFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(unitsFeature.selectDeleteError);

  loadPage(request: GetUnitsRequest): void {
    this.store.dispatch(UnitsActions.loadPage({ request }));
  }

  createUnit(request: CreateUnitRequest): void {
    this.store.dispatch(UnitsActions.createUnit({ request }));
  }

  updateUnit(request: UpdateUnitRequest): void {
    this.store.dispatch(UnitsActions.updateUnit({ request }));
  }

  deleteUnit(unitId: number): void {
    this.store.dispatch(UnitsActions.deleteUnit({ unitId }));
  }

  resetCreateState(): void {
    this.store.dispatch(UnitsActions.resetCreateUnitState());
  }

  resetUpdateState(): void {
    this.store.dispatch(UnitsActions.resetUpdateUnitState());
  }

  resetDeleteState(): void {
    this.store.dispatch(UnitsActions.resetDeleteUnitState());
  }
}
