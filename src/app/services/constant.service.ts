import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public serverUrl="http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8001/api/v1/";
  public loginUrl="";

  constructor() { 
    this.serverUrl = 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8001/api/v1/';
    //this.loginUrl = 'http://13.235.45.209:8000';
  }
  getUrl(){
    return this.serverUrl;
  }
}
