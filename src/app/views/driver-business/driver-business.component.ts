import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';


@Component({
  selector: 'app-driver-business',
  templateUrl: './driver-business.component.html',
  styleUrls: ['./driver-business.component.sass']
})
export class DriverBusinessComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverBusinessForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  constructor(private formBuilder: FormBuilder, public Driver: DriverService) { }

  ngOnInit() {
    this.editDriverBusinessForm = this.formBuilder.group({
      txtTermsOfService: [''],
      txtBusinessState: [''],
      txtBusinessCity: [''],
      txtBankName: [''],
      txtBankAccNo: [''],
      txtIFSCCode:[''],
      txtDriverAcc:[''],
      txtLicenceNo: ['', Validators.required],
   });
   var user = {
    "resource_id": 454,
    "resource_type":'drivers',
    "os_type":'web'
    }
  this.driverPostData = {user};
  this.Driver.getDriverDetails(this.driverPostData).subscribe(details=>{
    this.driverDetails = details['data']['user_detail'];
    console.log(this.driverDetails);
    console.log(this.driverDetails[0]['aadhaar_number']);
    this.editDriverBusinessForm.patchValue({
      txtTermsOfService: this.driverDetails[0]['aadhaar_number'],
      txtBusinessState: this.driverDetails[0]['business_state'],
      txtBusinessCity: this.driverDetails[0]['business_city'],
      txtBankName: this.driverDetails[0]['bank_name'],
      txtBankAccNo: this.driverDetails[0]['bank_no'],
      txtIFSCCode: this.driverDetails[0]['ifsc_code'],
     txtDriverAcc:  this.driverDetails[0]['aadhaar_number'],
     txtLicenceNo:  this.driverDetails[0]['licence_number'],
   });
   });
  }
  onEdit() {
    this.isEditModeOn = ! this.isEditModeOn;
    if(this.isEditModeOn){this.valueOfButton = "Cancel"}
    else{this.valueOfButton= "Edit"}
        return;
    }
    ShowImage(path){
     this.imageURL= path; 
    }
    // convenience getter for easy access to form fields
  get f() { return this.editDriverBusinessForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverBusinessForm.value;
    // stop here if form is invalid
    if (this.editDriverBusinessForm.invalid) {
    
        return;
    }
  }
}
