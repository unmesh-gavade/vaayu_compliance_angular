import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass']
})
export class DriverPersonalComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverPersonalForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService) { }

  ngOnInit() {
    this.editDriverPersonalForm = this.formBuilder.group({
       txtDriverName: ['', Validators.required],
       txtFatherSpouseName: ['', Validators.required],
       txtDateOfBirth: ['', Validators.required],
       txtGender: [''],
       txtContactNumber:  ['', Validators.required],
       txtMaritalStatus: [''],
       txtBloodGroup: [''],
       txtQualification: [''],
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
     this.editDriverPersonalForm.patchValue({
      txtDriverName: this.driverDetails[0]['aadhaar_number'],
      txtFatherSpouseName: this.driverDetails[0]['father_spouse_name'],
      txtDateOfBirth:  moment(this.driverDetails[0]['date_of_birth']).format("YYYY-MM-DD"),
      txtGender: this.driverDetails[0]['gender'],
      txtContactNumber: this.driverDetails[0]['aadhaar_mobile_number'],
      txtMaritalStatus: this.driverDetails[0]['marital_status'],
      txtBloodGroup: this.driverDetails[0]['blood_group'],
      txtQualification:  this.driverDetails[0]['qualification'],
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
  get f() { return this.editDriverPersonalForm.controls; }

    onSubmit() {

      this.submitted = true;
  
      var values = this.editDriverPersonalForm.value;
      // stop here if form is invalid
      if (this.editDriverPersonalForm.invalid) {
      
          return;
      }
    }
}
