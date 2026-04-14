import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { Supplier, SupplierDetails, CreateSupplierRequest, UpdateSupplierRequest, GetSuppliersRequest } from '../models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient) { }

  getAll(request: GetSuppliersRequest): Observable<PagedList<Supplier>> {

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

    if (request.contactName != null) {
      params = params.append("contactName", request.contactName);
    }

    if (request.compayName != null) {
      params = params.append("companyName", request.compayName);
    }

    if (request.contactPhone != null) {
      params = params.append("contactPhone", request.contactPhone);
    }
    return this.http.get<PagedList<Supplier>>(`${environment.baseUrl}/suppliers`, { params: params });
  }

  getById(id: number): Observable<SupplierDetails> {
    return this.http.get<SupplierDetails>(`${environment.baseUrl}/suppliers/${id}`);
  }

  create(request: CreateSupplierRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseUrl}/suppliers`, request);
  }


  update(request: UpdateSupplierRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/suppliers/${request.supplierId}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}/suppliers/${id}`);
  }

}
