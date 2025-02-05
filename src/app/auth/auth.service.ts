import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/constant.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DialogService } from '../../libs/ng2-bootstrap-modal';
import { ConfirmComponent } from '../views/confirm-component/confirm.component';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public serverUrl = "";

  errorData: {};

  public isLoggedIn = false;
  public isAuthorise = false;

  constructor(private http: HttpClient, private toastr: ToastrService, public ConstService: ConstantService, private router: Router,private dialogService:DialogService) {
    this.serverUrl = ConstService.loginUrl;
  }
  checkLogin() {
    const currentUser = this.getAuthUser();
    //const appToken = this.getAppToken();
    if (currentUser) {
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

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      observe: 'response'
    });
    let options = { headers: headers };
 
    return this.http.post<any>(`${this.serverUrl}/signin`, {
      'username': username,
      'password': password,
      'app':'web'
  }, {
      headers: new HttpHeaders()
          .set('Content-Type', 'application/json'),
      observe: 'response'
  })
  .pipe(map(user => {
    console.log(user);
      let client = user.headers.get('client');
      let access_token = user.headers.get('access_token');
      console.log(client);
      console.log(access_token);
      if (user['body']['data'] && user['body']['status'] == true) {
        sessionStorage.setItem('currentUser', JSON.stringify(user['body']['data']['data']));
        sessionStorage.setItem('client',client);
        sessionStorage.setItem('access_token',access_token);
        this.isLoggedIn = true;
      } else {
        this.toastr.error('Error', 'Invalid login credentials. Please try again.');
      }
  }),
  catchError(this.handleError)
  );
  }

  getAuthUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    } else {
      return false;
    }
  }

  getAppToken() {
    const appToken = sessionStorage.getItem('access_token');
    if (appToken) {
      // let tokenData = JSON.parse(appToken)
      return appToken;
    } else {
      return false;
    }
  }
  getClientToken() {
    const client = sessionStorage.getItem('client');
    if (client) {
      // let tokenData = JSON.parse(client)
      return client;
    } else {
      return false;
    }
  }
  logoutWithPop()
  {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
      title: 'Logout!',
      message: 'Are you sure you want to logout?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          disposable.unsubscribe();
          this.logout();
        } else {
          // disposable.unsubscribe();
          // this.logout();
        }
      });  
  }
  logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('client');
    sessionStorage.removeItem('access_token');
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

