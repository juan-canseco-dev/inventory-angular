import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  
  router = inject(Router);
  authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler) : Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403)  {
          this.authService.logOut();
        } 
        return throwError(() => error); // Re-throw the error for other handlers or components
      })
    );
  }


}
