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
    return this.http.post(this.baseUrl + 'dashboardFilter', data);
  }
  getBaList() {
    return this.http.post(this.baseUrl + 'getBAlist','')
  }
  getDashboardTats() {
    return this.http.post(this.baseUrl + 'getDashboardTatList','')
  }
}
