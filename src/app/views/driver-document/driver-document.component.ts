import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.sass']
})
export class DriverDocumentComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverDocumentForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  driverUpdateData:{};
  resource_id:String;
  resource_type:String;
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
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
    this.editDriverDocumentForm = this.formBuilder.group({
      txtPoliceVerification: [''],
      police_verification_vailidty: [''],
      date_of_police_verification: [''],
      criminal_offence: [''],
      bgc_date:[''],
      bgc_agency_id:[''],
      medically_certified_date:[''],
      sexual_policy: ['', Validators.required],
   });
   var user = {
    "resource_id": + this.resource_id,
    "resource_type":this.resource_type,
    "os_type":'web'
 }
  this.driverPostData = {user};
  this.Driver.getDriverDetails(this.driverPostData).subscribe(details=>{
    if (details['success'] == true) {
    this.driverDetails = details['data']['user_detail'];
    console.log(this.driverDetails);
    console.log(this.driverDetails[0]['aadhaar_number']);
    this.editDriverDocumentForm.patchValue({
      txtPoliceVerification: this.driverDetails[0]['txtPoliceVerification'],
      police_verification_vailidty: this.driverDetails[0]['police_verification_vailidty'],
      date_of_police_verification:  this.driverDetails[0]['date_of_police_verification'],
      criminal_offence: this.driverDetails[0]['criminal_offence'],
      bgc_date:  moment(this.driverDetails[0]['bgc_date']).format("YYYY-MM-DD"),
      bgc_agency_id: this.driverDetails[0]['bgc_agency_id'],
      medically_certified_date:  moment(this.driverDetails[0]['medically_certified_date']).format("YYYY-MM-DD"),
      sexual_policy:  this.driverDetails[0]['sexual_policy'],
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
    this.editDriverDocumentForm.patchValue({
      txtPoliceVerification: values.txtPoliceVerification,
      police_verification_vailidty: values.police_verification_vailidty,
      date_of_police_verification:  values.date_of_police_verification,
      criminal_offence: values.criminal_offence,
      bgc_date:   moment(values.bgc_date).format("YYYY-MM-DD"),
      bgc_agency_id:values.bgc_agency_id,
      medically_certified_date:   moment(values.medically_certified_date).format("YYYY-MM-DD"),
      sexual_policy:  values.sexual_policy,
    });
    var user = {
      "session_id":3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    var document={
      "approved_doc":'1,2',
      "rejected_doc":'3,4',
      "comment":'test'
    };
    var formData={};
    var data={formData:this.editDriverDocumentForm.value,document};
    this.driverUpdateData ={user,data};
    console.log(this.driverUpdateData);
    // update driver Documents details
    this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
      console.log(this.isEditModeOn);
      this.isEditModeOn=false;
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Documents Details updated successfully');
      }
      else{
        this.toastr.error('Error', 'Something went wrong');
      }
    }, errorResponse => {
      this.toastr.error('Error', errorResponse.error[0]);
    });
  }
  backToPersonal(resource_id)
    {
      console.log(resource_id);
      this.router.navigate(['/driver-business' ,{'resource_id':resource_id,'resource_type':'drivers' }]);  
    }
  sumbitDriver()
  {

  }
}
