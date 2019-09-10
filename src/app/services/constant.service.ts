import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public serverUrl="http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/induction/";
  public loginUrl="http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com";

  constructor() { 
    this.serverUrl = 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/induction/';
    this.loginUrl = 'http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com';
  }
  getUrl(){
    return this.serverUrl;
  }
}
