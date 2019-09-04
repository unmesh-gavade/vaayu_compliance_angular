import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  public baseUrl: String = "";

  constructor(private http: HttpClient, public constService : ConstantService) {
    this.baseUrl= constService.serverUrl;
   }

   getDriverDetails(data){
     return this.http.post(this.baseUrl + 'getDetails',data);
   }
   updateDriverDetails(data){
    return this.http.put(this.baseUrl +'saveDetails',data)
  }

}
