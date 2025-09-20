import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, delay, shareReplay, map, catchError, of, startWith, min } from 'rxjs';
import { Result, Failure } from '../../models/result';
import { PagedList } from '../../models/shared';
import { Supplier, SupplierDetails, CreateSupplierRequest, UpadteSupplierRequest, GetSuppliersRequest } from '../../models/supplier';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient) { }

  getAll(request: GetSuppliersRequest): Observable<Result<PagedList<Supplier>>> {

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
    return this.http.get<PagedList<Supplier>>(`${environment.baseUrl}/suppliers`, { params: params }).pipe(
      map((response: PagedList<Supplier>) => {

        if (!Array.isArray(response.items) || response.items.length == 0) {
          return Result.empty<PagedList<Supplier>>();
        } else {
          return Result.success(response);
        }
      }),
      catchError(error => {
        return of(Result.failure<PagedList<Supplier>>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<PagedList<Supplier>>()),
      shareReplay(1)
    );
  }

  getById(id: number): Observable<Result<SupplierDetails>> {
    return this.http.get<SupplierDetails>(`${environment.baseUrl}/suppliers/${id}`).pipe(
      map((response: SupplierDetails) => {
        return Result.success(response);
      }),
      catchError(error => {
        return of(Result.failure<SupplierDetails>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<SupplierDetails>()),
      shareReplay(1)
    );
  }

  create(request: CreateSupplierRequest): Observable<Result<number>> {
    return this.http.post<number>(`${environment.baseUrl}/suppliers`, request).pipe(
      map((response: number) => {
        return Result.success(response);
      }),
      catchError(error => {
        return of(Result.failure<number>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<number>()),
      shareReplay(1)
    );
  }


  update(request: UpadteSupplierRequest): Observable<Result<any>> {
    return this.http.put<any>(`${environment.baseUrl}/suppliers/${request.supplierId}`, request).pipe(
      map((_: any) => {
        return Result.success(true);
      }),
      catchError(error => {
        return of(Result.failure<any>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<any>()),
      shareReplay(1)
    );
  }

  delete(id: number): Observable<Result<any>> {
    return this.http.delete<any>(`${environment.baseUrl}/suppliers/${id}`).pipe(
      map((_: any) => {
        return Result.success(true);
      }),
      catchError(error => {
        return of(Result.failure<any>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<any>()),
      shareReplay(1)
    );
  }

}
