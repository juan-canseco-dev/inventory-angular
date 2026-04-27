import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Customer, CustomerDetails, CreateCustomerRequest, UpdateCustomerRequest, GetCustomersRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

   getAll(request: GetCustomersRequest): Observable<PagedList<Customer>> {

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

      if (request.dni != null) {
        params = params.append("dni", request.dni);
      }

      if (request.fullName != null) {
        params = params.append("fullName", request.fullName);
      }

      if (request.phone != null) {
        params = params.append("phone", request.phone);
      }
      return this.http.get<PagedList<Customer>>(`${environment.baseApiUrl}/customers`, { params: params });
    }

    getById(id: number): Observable<CustomerDetails> {
      return this.http.get<CustomerDetails>(`${environment.baseApiUrl}/customers/${id}`);
    }

    create(request: CreateCustomerRequest): Observable<number> {
      return this.http.post<number>(`${environment.baseApiUrl}/customers`, request);
    }


    update(request: UpdateCustomerRequest): Observable<any> {
      return this.http.put<any>(`${environment.baseApiUrl}/customers/${request.customerId}`, request);
    }

    delete(id: number): Observable<any> {
      return this.http.delete<any>(`${environment.baseApiUrl}/customers/${id}`);
    }
}
