
import { Injectable } from '@angular/core';
import { HttpErrorResponse,HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable,throwError } from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import { AuthService } from '../auth/auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  
    constructor(private authService: AuthService,private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

       // const currentUser = this.authService.getAuthUser();
        //const accessToken = this.authService.getAppToken();
        //const client = this.authService.getAuthorizationToken();
          const currentUser ="";
          const accessToken='s6XWBjuT_104sG6IwQ4KPg';
          const authToken="";
          const userId='deekshithmech@gmail.com';
        if (accessToken) {
            
            // req = req.clone({
            //     setHeaders:
            //         { 'Authenticate': ` Token ${authToken}` }
            //     },
            // );
            req = req.clone({
                setHeaders:
                    {'Content-Type': 'application/json'}
                },
            );
            req = req.clone({
                setHeaders:
                    {'uid': ` ${userId}`}
                },
            );
            req = req.clone({
                setHeaders:
                    {'access_token': ` ${accessToken}`}
                },
            );
            req = req.clone({
                setHeaders:
                    {'client': 'zf9ADoYFfW4R-sxvchlH7g'}
                },
            );
        }
        
        return next.handle(req).pipe(
            catchError(
            (error: HttpErrorResponse) => this.handleAuthError(error)
            )
        );
    }

    private handleAuthError(error: HttpErrorResponse): Observable<any>{
        // if (error.status === 200 && error.error.text === "Authorization failed" && this.authService.isLoggedIn) {
            // this.authService.isLoggedIn = false;
            // let disposable = this.dialogService.addDialog(ConfirmComponent, {
            //     title:'Session Expired!', 
            //     message:'Your login Session has been expired please login again'})
            //     .subscribe((isConfirmed)=>{
            //         if(isConfirmed) {
            //             disposable.unsubscribe();
            //             this.authService.logout();
            //         }else {
            //             disposable.unsubscribe();
            //             this.authService.logout();
            //         }
            // });
        // }
        return throwError(error);
    }
   
}
