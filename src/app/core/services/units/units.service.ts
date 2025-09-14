import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, delay, shareReplay, map, catchError, of, startWith, min } from 'rxjs';
import { Result, Failure } from '../../models/result';
import { PagedList } from '../../models/shared';
import { Unit, CreateUnitRequest, UpdateUnitRequest, GetUnitsRequest } from '../../models/units';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) { }

  getAll(request: GetUnitsRequest): Observable<Result<PagedList<Unit>>> {

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

    if (request.name != null) {
      params = params.append("name", request.name);
    }

    return this.http.get<PagedList<Unit>>(`${environment.baseUrl}/units`, { params: params }).pipe(
      map((response: PagedList<Unit>) => {

        if (!Array.isArray(response.items) || response.items.length == 0) {
          return Result.empty<PagedList<Unit>>();
        } else {
          return Result.success(response);
        }
      }),
      catchError(error => {
        return of(Result.failure<PagedList<Unit>>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<PagedList<Unit>>()),
      shareReplay(1)
    );
  }

  getById(id: number): Observable<Result<Unit>> {
    return this.http.get<Unit>(`${environment.baseUrl}/units/${id}`).pipe(
      map((response: Unit) => {
        return Result.success(response);
      }),
      catchError(error => {
        return of(Result.failure<Unit>(new Failure(error.error)));
      }),
      delay(0),
      startWith(Result.loading<Unit>()),
      shareReplay(1)
    );
  }

  create(request: CreateUnitRequest): Observable<Result<number>> {
    return this.http.post<number>(`${environment.baseUrl}/units`, request).pipe(
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


  update(request: UpdateUnitRequest): Observable<Result<any>> {
    return this.http.put<any>(`${environment.baseUrl}/units/${request.unitOfMeasurementId}`, request).pipe(
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
    return this.http.delete<any>(`${environment.baseUrl}/units/${id}`).pipe(
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
