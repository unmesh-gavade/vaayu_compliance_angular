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
   
   getDashboardList(data) {
    return this.http.post(this.baseUrl + 'v1/dashboardFilterer/', data);
  }
  getBaList() {
    return this.http.get(this.baseUrl + 'v1/getBAList/')
  }
  getDashboardTats() {
    return this.http.get(this.baseUrl + 'v1/getDashboardTats/')
  }
}
