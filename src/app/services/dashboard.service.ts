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

  constructor(private http: HttpClient, public constService : ConstantService) {
    this.baseUrl= constService.serverUrl;
   }
   
  getDashboardList(data) {
    console.log('url : '+this.baseUrl + 'dashboardFilter');
    console.log('body'+JSON.stringify(data));
    return this.http.post(this.baseUrl + 'dashboardFilter', data);
  }
  getBaList() {
    console.log('url : '+this.baseUrl + 'getAllBaList');
    return this.http.post(this.baseUrl + 'getAllBaList','');
  }
  getDashboardTats() {
    console.log('url : '+this.baseUrl + 'getDashboardTatList');
    return this.http.post(this.baseUrl + 'getDashboardTatList','')
  }

  getDashboardRenewalList(data) {
    console.log('url : '+this.baseUrl + 'getDashboardRenewalList');
    return this.http.post('http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8001/api/v1/induction/docdetails',data)
  }
}
