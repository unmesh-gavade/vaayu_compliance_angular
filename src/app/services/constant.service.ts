import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public serverUrl="http://13.235.45.209:8000/api/";
  public loginUrl="";

  constructor() { 
    this.serverUrl = 'http://13.235.45.209:8000/api/';
    //this.loginUrl = 'http://13.235.45.209:8000';
  }
  getUrl(){
    return this.serverUrl;
  }
}
