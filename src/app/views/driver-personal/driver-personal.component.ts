import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass']
})
export class DriverPersonalComponent implements OnInit {
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
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService) { }

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
      driver_name: this.driverDetails[0]['aadhaar_number'],
      father_spouse_name: this.driverDetails[0]['father_spouse_name'],
      date_of_birth:  moment(this.driverDetails[0]['date_of_birth']).format("YYYY-MM-DD"),
      gender: this.driverDetails[0]['gender'],
      aadhaar_mobile_number: this.driverDetails[0]['aadhaar_mobile_number'],
      marital_status: this.driverDetails[0]['marital_status'],
      blood_group: this.driverDetails[0]['blood_group'],
      qualification:  this.driverDetails[0]['qualification'],
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
        "resource_id": 454,
        "resource_type": 'drivers',
        "os_type": 'web'
      };
      var document={
        "approved_doc":'',
        "rejected_doc":'',
        "comment":'test'
      };
      var formData={};
      var data={formData:this.editDriverPersonalForm.value};
      this.driverUpdateData ={user,data,document};
      
       // update driver personal details
     this.Driver.updateDriverDetails(this.editDriverPersonalForm).subscribe(data => {
      console.log(this.editDriverPersonalForm);
     // this.router.navigate(['/contract/details/' +  data['contractid']]);
      this.toastr.success('Success', 'Driver Personal Details updated successfully');
   },errorResponse => {
       this.toastr.error('Error', errorResponse.error[0])
   });  
   
    }
}
