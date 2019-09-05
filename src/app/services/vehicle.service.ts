import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  public baseUrl: String = "";

  constructor(private http: HttpClient, public constService : ConstantService) {
    this.baseUrl= constService.serverUrl;
   }
   getVehicleDetails(data){
    return this.http.post(this.baseUrl + 'getDetails',data);
  }
  updateVehicleDetails(data){
   return this.http.put(this.baseUrl +'saveDetails',data)
 }
}
