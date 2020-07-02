import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.url);
        
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${currentUser.token}`
                }
            });
        } 

        return next.handle(request)
        .pipe(
            catchError(error => {
                    if(!this.isUnauthorizedOrForbidden(error)) {
                        return throwError(error);
                    }
                })
            );
    }

    isUnauthorizedOrForbidden(error) {
        return error.status && error.status !== 401 && error.status !== 403;
    }
    
}