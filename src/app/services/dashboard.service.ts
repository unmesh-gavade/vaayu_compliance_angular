import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public baseUrl: String = "";
  resource_type = 'vehicles';
  tat_type = 'new_request';
  isDriverSelected = false;
  toHide_verify_button = false;

  is_renewal = 0;

  constructor(private http: HttpClient, public constService : ConstantService) {
    this.baseUrl= constService.serverUrl;
  }
   
  getDashboardList(data) {
    this.is_renewal = 0;
    return this.http.post(this.baseUrl + 'dashboardFilter', data);
  }
  getBaList() {
    return this.http.post(this.baseUrl + 'getAllBaList','');
  }
  getDashboardTats() {
    return this.http.post(this.baseUrl + 'getDashboardTatList','')
  }

  getDashboardRenewalList(data) {
    this.is_renewal = 1;
    return this.http.post(this.baseUrl + 'docdetails',data)
  }
}
