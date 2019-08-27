import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styleUrls: ['./vehicle-document.component.sass']
})
export class VehicleDocumentComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editVehicleDocumentForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editVehicleDocumentForm = this.formBuilder.group({
      txtBusinessAssociateName: [''],
      txtBusinessArea: ['',Validators.required],
      txtDriverNameDetail1: [''],
      txtMobileDeviceNumber: [''],
      txtMobileIMEI: [''],
      txtMobileModelVersion:[''],
      txtLastServiceDate:[''],
   });
  }
  onEdit() {
    this.isEditModeOn = ! this.isEditModeOn;
    if(this.isEditModeOn){this.valueOfButton = "Cancel"}
    else{this.valueOfButton= "Edit"}
    console.log(this.isEditModeOn);
        return;
    }
    ShowImage(path){
      this.imageURL= path; 
     }
       // convenience getter for easy access to form fields
  get f() { return this.editVehicleDocumentForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editVehicleDocumentForm.value;
    // stop here if form is invalid
    if (this.editVehicleDocumentForm.invalid) {
    
        return;
    }
  }
}