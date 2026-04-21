import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateOrderRequest,
  GetOrdersRequest,
  Order,
  OrderDetails,
  UpdateOrderRequest
} from '../models';
import { Error, PagedList } from '../../../shared/types';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load Page': props<{ request: GetOrdersRequest }>(),
    'Load Page Success': props<{ page: PagedList<Order> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Order Details': props<{ orderId: number }>(),
    'Load Order Details Success': props<{ details: OrderDetails }>(),
    'Load Order Details Failure': props<{ error: Error }>(),
    'Reset Order Details State': emptyProps(),

    'Create Order': props<{ request: CreateOrderRequest }>(),
    'Create Order Success': props<{ orderId: number }>(),
    'Create Order Failure': props<{ error: Error }>(),
    'Reset Create Order State': emptyProps(),

    'Update Order': props<{ request: UpdateOrderRequest }>(),
    'Update Order Success': emptyProps(),
    'Update Order Failure': props<{ error: Error }>(),
    'Reset Update Order State': emptyProps(),

    'Delete Order': props<{ orderId: number }>(),
    'Delete Order Success': emptyProps(),
    'Delete Order Failure': props<{ error: Error }>(),
    'Reset Delete Order State': emptyProps()
  }
});
