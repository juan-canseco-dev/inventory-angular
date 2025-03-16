import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, delay, shareReplay, map, catchError, of, startWith } from 'rxjs';
import { Result, Failure } from '../../models/result';
import { PagedList } from '../../models/shared';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, GetCategoriesRequest } from '../../models/categories';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  
  getAll(request: GetCategoriesRequest) : Observable<Result<PagedList<Category>>> {
    
    let params = new HttpParams();

    if (request.pageNumber && request.pageNumber! > 0) {
      params.append("pageNumber", request.pageNumber!);
    }

    if (request.pageSize && request.pageSize! > 0) {
      params.append("pageSize", request.pageSize);
    }

    if (request.orderBy && request.orderBy!.trim().length > 0) {
      params.append("orderBy", request.orderBy); 
    }

    if (request.sortOrder && request.sortOrder!.trim().length > 0) {
      params.append("orderBy", request.sortOrder); 
    }

    if (request.name && request.name!.trim().length > 0) {
      params.append("name", request.name);
    }

    return this.http.get<PagedList<Category>>(`${environment.baseUrl}/api/categories`, {params: params}).pipe(
      map((response: PagedList<Category>) => {
        if (response.empty()) {
          return Result.empty<PagedList<Category>>();
        } else {
          return Result.success(response);
        }
      }),
      catchError(error => {
        return of(Result.failure<PagedList<Category>>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<PagedList<Category>>()),
      shareReplay(1)
    );
  }
  
  getById(id : number) : Observable<Result<Category>>{
    return this.http.get<Category>(`${environment.baseUrl}/api/categories/${id}`).pipe(
      map((response: Category) => {
        return Result.success(response);
      }),
      catchError(error => {
        return of(Result.failure<Category>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<Category>()),
      shareReplay(1)
    );
  }

  create(request: CreateCategoryRequest) : Observable<Result<number>> {
    return this.http.post<number>(`${environment.baseUrl}/api/categories`, request).pipe(
      map((response: number) => {
        return Result.success(response);
      }),
      catchError(error => {
        return of(Result.failure<number>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<number>()),
      shareReplay(1)
    );
  }


  update(request: UpdateCategoryRequest) : Observable<Result<any>> {
    return this.http.put<any>(`${environment.baseUrl}/api/categories/${request.categoryId}`, request).pipe(
      map((_: any) => {
        return Result.empty();
      }),
      catchError(error => {
        return of(Result.failure<any>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<any>()),
      shareReplay(1)
    );
  }

  delete(id: number) : Observable<Result<any>> {
    return this.http.delete<any>(`${environment.baseUrl}/api/categories/${id}`).pipe(
      map((_: any) => {
        return Result.empty();
      }),
      catchError(error => {
        return of(Result.failure<any>(new Failure(error.error)));
      }),
      delay(1000),
      startWith(Result.loading<any>()),
      shareReplay(1)
    );
  }

}
