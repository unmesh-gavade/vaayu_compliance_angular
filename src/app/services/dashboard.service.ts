import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public baseUrl: String = "";

  constructor(private http: HttpClient, public constService : ConstantService) {
    this.baseUrl= constService.serverUrl;
   }
   getDashboardList(){
     return this.http.get(this.baseUrl + '/')
   }
}
