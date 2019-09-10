import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/constant.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public serverUrl = "";

  errorData: {};

  public isLoggedIn = false;
  public isAuthorise = false;

  constructor(private http: HttpClient, private toastr: ToastrService, public ConstService: ConstantService, private router: Router) {
    this.serverUrl = ConstService.loginUrl;
  }
  checkLogin() {
    const currentUser = this.getAuthUser();
    const appToken = this.getAppToken();

    if (currentUser && appToken) {
      return true;
    }

    this.router.navigate(['/login']);
  }
  encryptPassword(text) {
    try {
      let secret = '$Ad,1sO>Mr=j1?b*H.jz$XMLiR+QyIzd?)w&Yy]KG/wr<:gGoxTR0TlI`C.f-<t'
      return CryptoJS.HmacSHA512(text, secret).toString();
    } catch (error) {

    }
  }

  login(username: string, password: string) {
    // var newusername = username.substr(0, username.indexOf('@'));
    // var encryptedData =  this.encryptPassword(password);

    // var dataLogin = {
    //   "username": '9000297298',
    //   "password": '012345',
    //   "app": 'driver'
    // };
    var dataLogin = {
      "username":username ,
      "password": password,
      "app": 'driver'
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = { headers: headers };
    return this.http.post<any>(`${this.serverUrl}/signin`, dataLogin, options)
      .pipe(map(user => {
        console.log([user.status]);
        if (user['data'] && user.status == true) {
          console.log(user['data']);
          localStorage.setItem('currentUser', JSON.stringify(user['data']));
          this.isLoggedIn = true;
        } else {
          this.toastr.error('Error', 'Invalid login credentials. Please try again.');
        }
      }),
        catchError(this.handleError)
      );
  }

  getAuthUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return false;
    }
  }

  getAppToken() {
    const appToken = localStorage.getItem('appToken');
    if (appToken) {
      let tokenData = JSON.parse(appToken)
      return tokenData.data;
    } else {
      return false;
    }
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('appToken');
    this.isLoggedIn = false;
    this.isAuthorise = false;
    this.router.navigate(['/login']);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      this.toastr.error('Error', error.error.message);

      console.error('An error occurred:', 'Invalid Credentials');
    } else {

      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong.
      this.toastr.error('Error', 'Invalid Credentials');
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    this.toastr.error('Error', 'Bad request');

    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

}

