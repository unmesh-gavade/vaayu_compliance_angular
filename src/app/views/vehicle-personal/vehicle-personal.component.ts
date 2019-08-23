import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-business',
  templateUrl: './vehicle-personal.component.html',
  styleUrls: ['./vehicle-personal.component.sass']
})
export class VehiclePersonalComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editVehiclePersonalForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editVehiclePersonalForm = this.formBuilder.group({
      txtRegistrationNo: ['',Validators.required],
      txtVehicleCategory: ['',Validators.required],
      txtVehicleModel: ['',Validators.required],
      txtSeatingCapacity: ['',Validators.required],
      txtColor: [''],
      txtTypeOfFuel:[''],
      txtACNon:[''],
      txtGPSDevice:['']
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
  get f() { return this.editVehiclePersonalForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editVehiclePersonalForm.value;
    // stop here if form is invalid
    if (this.editVehiclePersonalForm.invalid) {
    
        return;
    }
  }
}
