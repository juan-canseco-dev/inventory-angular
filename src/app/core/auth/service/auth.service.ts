import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { SignInRequest, JwtResponse, UserDetails } from '../models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

   signIn(request: SignInRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.baseApiUrl}/auth/singIn`, request);
  }

  setJwt(token: string): void {
    localStorage.setItem('token', token);
  }

  removeJwt(): void {
    localStorage.removeItem('token');
  }

  clearSession(): void {
    this.removeJwt();
    this.navigateToLogin();
  }

  navigateToLogin() : void {
    this.router.navigateByUrl('/auth');
  }

  navigateToHome(): void {
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  getUser(): UserDetails | null {
    if (this.isLoggedIn() === false) {
      return null;
    }
    var token = this.getToken()!;
    return this.jwtHelper.decodeToken(token) as UserDetails;
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return !!user && user.permissions.includes(permission);
  }
}
