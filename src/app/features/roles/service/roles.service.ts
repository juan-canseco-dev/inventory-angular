import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedList } from '../../../shared/types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetRolesRequest, CreateRoleRequest, UpdateRoleRequest, Role, RoleDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  http = inject(HttpClient);


     getAll(request: GetRolesRequest): Observable<PagedList<Role>> {

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

        return this.http.get<PagedList<Role>>(`${environment.baseApiUrl}/roles`, { params: params });
      }

      getById(id: number): Observable<RoleDetails> {
        return this.http.get<RoleDetails>(`${environment.baseApiUrl}/roles/${id}`);
      }

      create(request: CreateRoleRequest): Observable<number> {
        return this.http.post<number>(`${environment.baseApiUrl}/roles`, request);
      }


      update(request: UpdateRoleRequest): Observable<any> {
        return this.http.put<any>(`${environment.baseApiUrl}/roles/${request.roleId}`, request);
      }

      delete(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.baseApiUrl}/roles/${id}`);
      }

}
