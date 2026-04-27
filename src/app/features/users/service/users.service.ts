import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedList } from '../../../shared/types';
import {
  ChangeUserRoleRequest,
  CreateUserRequest,
  GetUsersRequest,
  UpdateUserRequest,
  User,
  UserWithDetails
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getAll(request: GetUsersRequest): Observable<PagedList<User>> {
    let params = new HttpParams();

    if (request.pageNumber != null) {
      params = params.append('pageNumber', request.pageNumber);
    }

    if (request.pageSize != null) {
      params = params.append('pageSize', request.pageSize);
    }

    if (request.orderBy != null) {
      params = params.append('orderBy', request.orderBy);
    }

    if (request.sortOrder != null) {
      params = params.append('sortOrder', request.sortOrder);
    }

    if (request.fullName != null) {
      params = params.append('fullName', request.fullName);
    }

    if (request.email != null) {
      params = params.append('email', request.email);
    }

    return this.http.get<PagedList<User>>(`${environment.baseApiUrl}/users`, {
      params
    });
  }

  getById(id: number): Observable<UserWithDetails> {
    return this.http.get<UserWithDetails>(`${environment.baseApiUrl}/users/${id}`);
  }

  create(request: CreateUserRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseApiUrl}/users`, request);
  }

  update(request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${environment.baseApiUrl}/users/${request.userId}`, request);
  }

  changeRole(request: ChangeUserRoleRequest): Observable<void> {
    return this.http.put<void>(`${environment.baseApiUrl}/users/${request.userId}/changeRole`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseApiUrl}/users/${id}`);
  }
}
