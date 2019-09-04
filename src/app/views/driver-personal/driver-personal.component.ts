import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DriverService} from '../../services/driver.service'

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
    

    var data = {
      "resource_id": 454,
      "resource_type":'drivers',
      "os_type":'web'
   }
  
    this.Driver.getDriverDetails(data).subscribe(details=>{
     this.driverDetails = details;
     console.log(this.driverDetails);
    })
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
