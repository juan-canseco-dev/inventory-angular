import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { toLocalDateTimeString } from '../../../shared/utils/time.utils';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Purchase, PurchaseDetails, UpdatePurchaseRequest, CreatePurchaseRequest, ReceivePurchaseRequest, GetPurchasesRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  http = inject(HttpClient);
  getAll(request: GetPurchasesRequest): Observable<PagedList<Purchase>> {

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

    if (request.supplierId != null) {
      params = params.append("supplierId", request.supplierId);
    }

    if (request.arrived != null) {
      params = params.append("delivered", request.arrived);
    }

    if (request.orderedAtStartDate != null) {
      params = params.append("orderedAtStartDate", toLocalDateTimeString(request.orderedAtStartDate));
    }

    if (request.orderedAtEndDate != null) {
      params = params.append("orderedAtEndDate", toLocalDateTimeString(request.orderedAtEndDate));
    }
    if (request.arrivedAtStartDate != null) {
      params = params.append("arrivedAtStartDate", toLocalDateTimeString(request.arrivedAtStartDate));
    }
    if (request.arrivedAtEndDate != null) {
      params = params.append("arrivedAtEndDate", toLocalDateTimeString(request.arrivedAtEndDate));
    }

    return this.http.get<PagedList<Purchase>>(`${environment.baseUrl}/purchases`, { params: params });
  }

  getById(id: number): Observable<PurchaseDetails> {
    return this.http.get<PurchaseDetails>(`${environment.baseUrl}/purchases/${id}`);
  }

  create(request: CreatePurchaseRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseUrl}/purchases`, request);
  }


  update(request: UpdatePurchaseRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/purchases/${request.purchaseId}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}/purchases/${id}`);
  }

  receive(request: ReceivePurchaseRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/purchases/receive`, request);
  }
}
