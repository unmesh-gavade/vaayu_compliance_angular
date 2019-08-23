import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editDriverPersonalForm = this.formBuilder.group({
       txtDriverName: ['', Validators.required],
       txtFatherSpouseName: ['', Validators.required],
       txtDateOfBirth: ['', Validators.required],
       txtGender: [''],
       txtContactNumber: [''],
       txtMaritalStatus: [''],
       txtBloodGroup: [''],
       txtQualification: [''],
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
