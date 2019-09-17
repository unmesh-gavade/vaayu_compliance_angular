import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {VehicleService} from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styleUrls: ['./vehicle-document.component.sass']
})
export class VehicleDocumentComponent implements OnInit {

  zoom: number = 1.0;
originalSize: boolean = true;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editVehicleDocumentForm: FormGroup;
  submitted = false;
  vehicleDetails : object;
  vehiclePostData : {};
  pdfDocs:{};
  vehicleUpdateData:{};
  resource_id:String;
  resource_type:String;
  userRole:String;
  isDataENtry=false;
  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }


  
  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
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
        $('.pdf_box1 li').eq(index).addClass('activepdf').siblings().removeClass('activepdf');
      });
      $('.nextpdf').click( function(){
        $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf');
      });
      $('.prevpdf').click( function(){
        $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
      });
  });

    this.pdfs = [
      {doc_display_name: 'Insurance', doc_url: './assets/images/myfile.pdf', id: '1', status: 'rejected', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {doc_display_name: 'RC Book', doc_url: './assets/images/pdf.pdf', id: '2', status: 'approved', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {doc_display_name: 'Fitness Certificate', doc_url: './assets/images/PDFTRON_about.pdf', id: '3', status: 'rejected', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  ];
  
    this.editVehicleDocumentForm = this.formBuilder.group({
      business_associate_id: [''],
      business_area_id: ['',Validators.required],
      driver_name: [''],
      txtMobileDeviceNumber: [''],
      txtMobileIMEI: [''],
      txtMobileModelVersion:[''],
      last_service_date:[''],
   });
   var user = {
    "resource_id": + this.resource_id,
    "resource_type":this.resource_type,
    "os_type":'web'
 }
  this.vehiclePostData = {user};
console.log(this.vehiclePostData);
  this.Vehicle.getVehicleDetails(this.vehiclePostData).subscribe(details=>{
    if (details['success'] == true) {
   this.vehicleDetails = details['data']['user_detail'];
   this.pdfDocs= details['data']['doc_list'];
   console.log(details['data']['user_detail']);
   this.editVehicleDocumentForm.patchValue({
    business_associate_id: this.vehicleDetails[0]['business_associate_id'],
    business_area_id: this.vehicleDetails[0]['business_area_id'],
    driver_name: this.vehicleDetails[0]['driver_name'],
    txtMobileDeviceNumber: this.vehicleDetails[0]['aadhaar_number'],
    txtMobileIMEI: this.vehicleDetails[0]['aadhaar_number'],
    txtMobileModelVersion: this.vehicleDetails[0]['aadhaar_number'],
    last_service_date: this.vehicleDetails[0]['last_service_date'],
  });
}
else{
  this.toastr.error('Error', 'Something Went Wrong.');
}
  });

  }
  incrementZoom(amount: number) {
    this.zoom += amount;   }
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
    this.editVehicleDocumentForm.patchValue({
      business_associate_id: values.business_associate_id,
      business_area_id: values.business_area_id,
      driver_name:  values.driver_name,
      txtMobileDeviceNumber: values.txtMobileDeviceNumber,
      txtMobileIMEI: values.txtMobileIMEI,
      txtMobileModelVersion: values.txtMobileModelVersion,
      last_service_date: values.last_service_date,
    });
    var user = {
      "session_id":3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    var document={
      "approved_doc":'',
      "rejected_doc":'',
      "comment":'test'
    };
    var formData={};
    var data={formData:this.editVehicleDocumentForm.value};
    this.vehicleUpdateData ={user,data,document};
    // update vehicle documents details
    this.Vehicle.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      if (res['success'] == true) {
        console.log(this.isEditModeOn);
        this.isEditModeOn=false;
        if(this.isEditModeOn){this.valueOfButton = "Cancel"}
        else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Vehicle Documents Details updated successfully');
      }
      else{
        this.toastr.error('Error', 'Something went wrong');
      }
    }, errorResponse => {
      this.toastr.error('Error', errorResponse.error[0])
    });


  }
  backToPersonal(resource_id)
  {
    console.log(resource_id);
    this.router.navigate(['/vehicle-personal' ,{'resource_id':resource_id,'resource_type':'vehicles' }]);  
  }
}
