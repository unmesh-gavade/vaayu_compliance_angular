import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantService } from "./constant.service";

@Injectable({
  providedIn: "root"
})
export class DriverService {
  public baseUrl: String = "";

  constructor(private http: HttpClient, public constService: ConstantService) {
    this.baseUrl = constService.serverUrl;
  }

  getDriverDetails(data) {
    return this.http.post(
      "http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com:8001/api/v1/" + "getDetails",
      data
    );
  }
  updateDriverDetails(data) {
    return this.http.post(this.baseUrl + "saveDetails", data);
  }
  getSiteList() {
    return this.http.post("http://ec2-13-233-214-215.ap-south-1.compute.amazonaws.com/getAllSiteList", "");
  }
}
