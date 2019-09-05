import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {VehicleService} from '../../services/vehicle.service';
import * as moment from 'moment';

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
  vehicleDetails : object;
  vehiclePostData : {};

  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService) { }

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
   var user = {
    "resource_id": 373,
    "resource_type":'vehicles',
    "os_type":'web'
 }
  this.vehiclePostData = {user};

  this.Vehicle.getVehicleDetails(this.vehiclePostData).subscribe(details=>{
    console.log(details);
   this.vehicleDetails = details['data']['user_detail'];
   console.log(this.vehicleDetails);
   this.editVehiclePersonalForm.patchValue({
    txtRegistrationNo: this.vehicleDetails[0]['aadhaar_number'],
    txtVehicleCategory: this.vehicleDetails[0]['category'],
    txtVehicleModel:  this.vehicleDetails[0]['model'],
    txtSeatingCapacity: this.vehicleDetails[0]['gender'],
    txtColor: this.vehicleDetails[0]['colour'],
    txtTypeOfFuel: this.vehicleDetails[0]['fuel_type'],
    txtACNon: this.vehicleDetails[0]['ac'],
    txtGPSDevice:  this.vehicleDetails[0]['gps_provider_id'],
  });
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
