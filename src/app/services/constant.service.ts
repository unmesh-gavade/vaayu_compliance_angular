import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  public serverUrl=environment.serverUrl;
  public loginUrl=environment.loginUrl;

  constructor() { 
    // this.serverUrl = 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/induction/';
    // this.loginUrl = 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com';
    this.serverUrl=environment.serverUrl;
    this.loginUrl=environment.loginUrl;
    console.log(this.serverUrl);
    console.log(environment.environmentName);
  }
  getUrl(){
    return this.serverUrl;
  }
}
