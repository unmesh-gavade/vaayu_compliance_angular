import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  public baseUrl: String = "";

  constructor(private http: HttpClient, public constService: ConstantService) {
    this.baseUrl = constService.serverUrl;
  }
  getVehicleDetails(data) {
    return this.http.post(this.baseUrl + 'getDetails', data);
  }
  updateVehicleDetails(data) {
    return this.http.post(this.baseUrl + 'saveDetails', data)
  }

  getBaList() {
    return this.http.post(this.baseUrl + 'getAllBaList', '');
  }

  getSiteList() {
    return this.http.post('http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/getAllSiteList', '');
  }
}
