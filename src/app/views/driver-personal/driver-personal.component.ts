import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass']
})
export class DriverPersonalComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverPersonalForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  driverUpdateData:{};
  resource_id:String;
  resource_type:String;
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    //this.authService.checkLogin();
     this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    console.log(this.resource_id);
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
    
    this.editDriverPersonalForm = this.formBuilder.group({
       driver_name: ['', Validators.required],
       father_spouse_name: ['', Validators.required],
       date_of_birth: ['', Validators.required],
       gender: [''],
       aadhaar_mobile_number:  ['', Validators.required],
       marital_status: [''],
       blood_group: [''],
       qualification: [''],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type":this.resource_type,
      "os_type":'web'
   }
    this.driverPostData = {user};
    console.log(this.driverPostData);
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      console.log(details);
      if (details['success'] == true) {
        this.driverDetails = details['data']['user_detail'];
        console.log(this.driverDetails);
        console.log(this.driverDetails[0]['aadhaar_number']);
        this.editDriverPersonalForm.patchValue({
          driver_name: this.driverDetails[0]['driver_name'],
          father_spouse_name: this.driverDetails[0]['father_spouse_name'],
          date_of_birth: moment(this.driverDetails[0]['date_of_birth']).format("YYYY-MM-DD"),
          gender: this.driverDetails[0]['gender'],
          aadhaar_mobile_number: this.driverDetails[0]['aadhaar_mobile_number'],
          marital_status: this.driverDetails[0]['marital_status'],
          blood_group: this.driverDetails[0]['blood_group'],
          qualification: this.driverDetails[0]['qualification'],
        });
      }
      else {
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
  get f() { return this.editDriverPersonalForm.controls; }

    onSubmit() {

      this.submitted = true;
  
      var values = this.editDriverPersonalForm.value;
      // stop here if form is invalid
      if (this.editDriverPersonalForm.invalid) {
      
          return;
      }
      this.editDriverPersonalForm.patchValue({
        driver_name: values.driver_name,
        father_spouse_name: values.father_spouse_name,
        date_of_birth:  moment(values.date_of_birth).format("YYYY-MM-DD"),
        gender: values.gender,
        aadhaar_mobile_number: values.aadhaar_mobile_number,
        marital_status: values.marital_status,
        blood_group: values.blood_group,
        qualification: values.qualification 
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
      var data={formData:this.editDriverPersonalForm.value,document};
      this.driverUpdateData ={user,data};
      
       // update driver personal details
     this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
      console.log(this.isEditModeOn);
      this.isEditModeOn=false;
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Personal Details updated successfully')
      }
      else{
        this.toastr.error('Error', 'Something went wrong');
      }
   },errorResponse => {
       this.toastr.error('Error', errorResponse.error[0])
   });  
   
    }
    saveDocsStatus(resource_id)
    {
      console.log(resource_id);
      this.router.navigate(['/driver-business' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
    }
}
