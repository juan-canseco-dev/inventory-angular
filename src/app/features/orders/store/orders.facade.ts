import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CreateOrderRequest,
  GetOrdersRequest,
  UpdateOrderRequest
} from '../models';
import { OrdersActions } from './orders.actions';
import { ordersFeature } from './orders.feature';

@Injectable({
  providedIn: 'root'
})
export class OrdersFacade {
  private readonly store = inject(Store);

  readonly page = this.store.selectSignal(ordersFeature.selectPage);
  readonly orders = this.store.selectSignal(ordersFeature.selectOrders);
  readonly loading = this.store.selectSignal(ordersFeature.selectIsLoading);
  readonly loadError = this.store.selectSignal(ordersFeature.selectLoadError);
  readonly empty = this.store.selectSignal(ordersFeature.selectIsEmpty);

  readonly orderDetails = this.store.selectSignal(ordersFeature.selectOrderDetails);
  readonly orderDetailsLoading = this.store.selectSignal(ordersFeature.selectOrderDetailsLoading);
  readonly orderDetailsSuccess = this.store.selectSignal(ordersFeature.selectOrderDetailsSuccess);
  readonly orderDetailsError = this.store.selectSignal(ordersFeature.selectOrderDetailsError);

  readonly createLoading = this.store.selectSignal(ordersFeature.selectCreateLoading);
  readonly createSuccess = this.store.selectSignal(ordersFeature.selectCreateSuccess);
  readonly createError = this.store.selectSignal(ordersFeature.selectCreateError);

  readonly updateLoading = this.store.selectSignal(ordersFeature.selectUpdateLoading);
  readonly updateSuccess = this.store.selectSignal(ordersFeature.selectUpdateSuccess);
  readonly updateError = this.store.selectSignal(ordersFeature.selectUpdateError);

  readonly deleteLoading = this.store.selectSignal(ordersFeature.selectDeleteLoading);
  readonly deleteSuccess = this.store.selectSignal(ordersFeature.selectDeleteSuccess);
  readonly deleteError = this.store.selectSignal(ordersFeature.selectDeleteError);

  loadPage(request: GetOrdersRequest): void {
    this.store.dispatch(OrdersActions.loadPage({ request }));
  }

  loadOrderDetails(orderId: number): void {
    this.store.dispatch(OrdersActions.loadOrderDetails({ orderId }));
  }

  createOrder(request: CreateOrderRequest): void {
    this.store.dispatch(OrdersActions.createOrder({ request }));
  }

  updateOrder(request: UpdateOrderRequest): void {
    this.store.dispatch(OrdersActions.updateOrder({ request }));
  }

  deleteOrder(orderId: number): void {
    this.store.dispatch(OrdersActions.deleteOrder({ orderId }));
  }

  resetOrderDetailsState(): void {
    this.store.dispatch(OrdersActions.resetOrderDetailsState());
  }

  resetCreateState(): void {
    this.store.dispatch(OrdersActions.resetCreateOrderState());
  }

  resetUpdateState(): void {
    this.store.dispatch(OrdersActions.resetUpdateOrderState());
  }

  resetDeleteState(): void {
    this.store.dispatch(OrdersActions.resetDeleteOrderState());
  }
}
