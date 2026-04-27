import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, GetCategoriesRequest } from '../models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }


  getAll(request: GetCategoriesRequest) : Observable<PagedList<Category>> {

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

    return this.http.get<PagedList<Category>>(`${environment.baseApiUrl}/categories`, {params: params});
  }

  getById(id : number) : Observable<Category>{
    return this.http.get<Category>(`${environment.baseApiUrl}/categories/${id}`);
  }

  create(request: CreateCategoryRequest) : Observable<number> {
    return this.http.post<number>(`${environment.baseApiUrl}/categories`, request);
  }


  update(request: UpdateCategoryRequest) : Observable<any> {
    return this.http.put<any>(`${environment.baseApiUrl}/categories/${request.categoryId}`, request);
  }

  delete(id: number) : Observable<any> {
    return this.http.delete<any>(`${environment.baseApiUrl}/categories/${id}`);
  }
}
