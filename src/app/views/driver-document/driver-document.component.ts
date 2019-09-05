import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';


@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.sass']
})
export class DriverDocumentComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverDocumentForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  constructor(private formBuilder: FormBuilder, public Driver: DriverService) { }

  ngOnInit() {
    this.editDriverDocumentForm = this.formBuilder.group({
      txtPoliceVerification: [''],
      txtPoliceVerificationValidity: [''],
      txtDateOfPoliceVeri: [''],
      txtCriminalOffense: [''],
      txtBGCDate:[''],
      txtBGCAgency:[''],
      txtMedicalCertifiedDate:[''],
      txtSexualHarr: ['', Validators.required],
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
    this.editDriverDocumentForm.patchValue({
      txtPoliceVerification: this.driverDetails[0]['aadhaar_number'],
      txtPoliceVerificationValidity: this.driverDetails[0]['police_verification_vailidty'],
      txtDateOfPoliceVeri:  this.driverDetails[0]['date_of_police_verification'],
      txtCriminalOffense: this.driverDetails[0]['criminal_offence'],
      txtBGCDate:  moment(this.driverDetails[0]['bgc_date']).format("YYYY-MM-DD"),
      txtBGCAgency: this.driverDetails[0]['bgc_agency_id'],
      txtMedicalCertifiedDate:  moment(this.driverDetails[0]['medically_certified_date']).format("YYYY-MM-DD"),
      txtSexualHarr:  this.driverDetails[0]['sexual_policy'],
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
   get f() { return this.editDriverDocumentForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverDocumentForm.value;
    // stop here if form is invalid
    if (this.editDriverDocumentForm.invalid) {
    
        return;
    }
  }
}
