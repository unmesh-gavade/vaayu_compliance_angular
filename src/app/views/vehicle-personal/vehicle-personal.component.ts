import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {VehicleService} from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-business',
  templateUrl: './vehicle-personal.component.html',
  styleUrls: ['./vehicle-personal.component.sass']
})
export class VehiclePersonalComponent implements OnInit {
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editVehiclePersonalForm: FormGroup;
  submitted = false;
  vehicleDetails : object;
  vehiclePostData : {};

  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService, private toastr: ToastrService) { }

  ngOnInit() {
    $(window).ready(function(){
      $('.pdf_reject').click(function(){
        $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('approved').addClass('rejected');      
      });
      $('.pdf_approve').click(function(){
         $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('rejected').addClass('approved');
       });
       $('.pdf_preview').click(function(){
         $('.activepdf > .togglepdf').removeClass('approved').removeClass('rejected').addClass('nonstatus');
       });
      $('.pdf_nav ul li').click(function() {
        var index = $(this).index();
        $(this).addClass('activepdf').siblings().removeClass('activepdf');
        $('.pdf_box li').eq(index).addClass('activepdf').siblings().removeClass('activepdf');
      });
      $('.nextpdf').click( function(){
        $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf')
      });
      $('.prevpdf').click( function(){
        $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
      });
  });

    this.pdfs = [
      {doc_display_name: 'Insurance', doc_url: './assets/images/myfile.pdf', id: '1', status: 'none', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {doc_display_name: 'RC Book', doc_url: './assets/images/pdf.pdf', id: '2', status: 'approved', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {doc_display_name: 'Fitness Certificate', doc_url: './assets/images/PDFTRON_about.pdf', id: '3', status: 'rejected', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  ];
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

    this.editVehiclePersonalForm.patchValue({
      txtRegistrationNo: values.txtRegistrationNo,
      txtVehicleCategory: values.txtVehicleCategory,
      txtVehicleModel:  values.txtVehicleModel,
      txtSeatingCapacity: values.txtSeatingCapacity,
      txtColor: values.txtColor,
      txtTypeOfFuel: values.txtTypeOfFuel,
      txtACNon: values.txtACNon,
      txtGPSDevice:  values.txtGPSDevice,
    });

    // update vehicle personal details
    this.Vehicle.updateVehicleDetails(this.editVehiclePersonalForm).subscribe(data => {
      // this.router.navigate(['/contract/details/' +  data['contractid']]);
      this.toastr.success('Success', 'Vehicle Personal Details updated successfully');
    }, errorResponse => {
      this.toastr.error('Error', errorResponse.error[0])
    });

  }
}
