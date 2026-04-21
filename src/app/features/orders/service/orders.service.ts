import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { toLocalDateTimeString } from '../../../shared/utils/time.utils';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order, OrderDetails, UpdateOrderRequest, CreateOrderRequest, DeliverOrderRequest, GetOrdersRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  http = inject(HttpClient);
  getAll(request: GetOrdersRequest): Observable<PagedList<Order>> {

    let params = new HttpParams();

    if (request.pageNumber != null) {
      params = params.append("pageNumber", request.pageNumber!);
    }

    if (request.pageSize != null) {
      params = params.append("pageSize", request.pageSize);
    }

    if (request.orderBy != null) {
      params = params.append("orderBy", request.orderBy);
    }

    if (request.sortOrder != null) {
      params = params.append("sortOrder", request.sortOrder);
    }

    if (request.customerId != null) {
      params = params.append("customerId", request.customerId);
    }

    if (request.delivered != null) {
      params = params.append("delivered", request.delivered);
    }

    if (request.orderedAtStartDate != null) {
      params = params.append("orderedAtStartDate", toLocalDateTimeString(request.orderedAtStartDate));
    }

    if (request.orderedAtEndDate != null) {
      params = params.append("orderedAtEndDate", toLocalDateTimeString(request.orderedAtEndDate));
    }
    if (request.deliveredAtStartDate != null) {
      params = params.append("deliveredAtStartDate", toLocalDateTimeString(request.deliveredAtStartDate));
    }
    if (request.deliveredAtEndDate != null) {
      params = params.append("deliveredAtEndDate", toLocalDateTimeString(request.deliveredAtEndDate));
    }

    return this.http.get<PagedList<Order>>(`${environment.baseUrl}/orders`, { params: params });
  }

  getById(id: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${environment.baseUrl}/orders/${id}`);
  }

  create(request: CreateOrderRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseUrl}/orders`, request);
  }


  update(request: UpdateOrderRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/orders/${request.orderId}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}/orders/${id}`);
  }

  deliver(request: DeliverOrderRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/orders/deliver`, request);
  }
}
