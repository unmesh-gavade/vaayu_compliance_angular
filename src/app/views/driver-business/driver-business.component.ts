import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { DriverService } from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConcatSource } from 'webpack-sources';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-business',
  templateUrl: './driver-business.component.html',
  styleUrls: ['./driver-business.component.sass']
})
export class DriverBusinessComponent implements OnInit {
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL = "./assets/img/Doc.jpg";
  editDriverBusinessForm: FormGroup;
  submitted = false;
  driverDetails: object;
  driverPostData: {};
  driverUpdateData:{};

  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr: ToastrService,private router: Router) { }

  ngOnInit() {
    //this.authService.checkLogin();
    $(window).ready(function () {
      $('.pdf_reject').click(function () {
        $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('approved').addClass('rejected');
      });
      $('.pdf_approve').click(function () {
        $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('rejected').addClass('approved');
      });
      $('.pdf_preview').click(function () {
        $('.activepdf > .togglepdf').removeClass('approved').removeClass('rejected').addClass('nonstatus');
      });
      $('.pdf_nav ul li').click(function () {
        var index = $(this).index();
        $(this).addClass('activepdf').siblings().removeClass('activepdf');
        $('.pdf_box li').eq(index).addClass('activepdf').siblings().removeClass('activepdf');
      });
      $('.nextpdf').click(function () {
        $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf')
      });
      $('.prevpdf').click(function () {
        $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
      });
    });

    this.pdfs = [
      { doc_display_name: 'Insurance', doc_url: './assets/images/myfile.pdf', id: '1', status: 'none', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { doc_display_name: 'RC Book', doc_url: './assets/images/pdf.pdf', id: '2', status: 'approved', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { doc_display_name: 'Fitness Certificate', doc_url: './assets/images/PDFTRON_about.pdf', id: '3', status: 'rejected', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
    ];
    this.editDriverBusinessForm = this.formBuilder.group({
      //txtTermsOfService: [''],
      business_state: [''],
      business_city: [''],
      bank_name: [''],
      bank_no: [''],
      ifsc_code: [''],
     // txtDriverAcc: [''],
      licence_number: ['', Validators.required],
    });
    var user = {
      "resource_id": 454,
      "resource_type": 'drivers',
      "os_type": 'web'
    }
    this.driverPostData = { user };
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      this.driverDetails = details['data']['user_detail'];
      console.log(this.driverDetails);
      console.log(this.driverDetails[0]['aadhaar_number']);
      this.editDriverBusinessForm.patchValue({
        //txtTermsOfService: this.driverDetails[0]['aadhaar_number'],
        business_state: this.driverDetails[0]['business_state'],
        business_city: this.driverDetails[0]['business_city'],
        bank_name: this.driverDetails[0]['bank_name'],
        bank_no: this.driverDetails[0]['bank_no'],
        ifsc_code: this.driverDetails[0]['ifsc_code'],
        //txtDriverAcc: this.driverDetails[0]['aadhaar_number'],
        licence_number: this.driverDetails[0]['licence_number'],
      });
    });
  }
  onEdit() {
    this.isEditModeOn = !this.isEditModeOn;
    if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
    else { this.valueOfButton = "Edit" }
    return;
  }
  ShowImage(path) {
    this.imageURL = path;
  }
  // convenience getter for easy access to form fields
  get f() { return this.editDriverBusinessForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverBusinessForm.value;
    // stop here if form is invalid
    if (this.editDriverBusinessForm.invalid) {

      return;
    }
    this.editDriverBusinessForm.patchValue({
      //txtTermsOfService: values.txtTermsOfService,
      business_state: values.business_state,
      business_city: values.business_city,
      bank_name: values.bank_name,
      bank_no: values.bank_no,
      ifsc_code: values.ifsc_code,
      // txtDriverAcc: values.txtDriverAcc,
       licence_number: values.licence_number
    });
    var user = {
      "session_id":3403,
      "resource_id": 454,
      "resource_type": 'drivers',
      "os_type": 'web'
    };
    var document={
      "approved_doc":'1,2',
      "rejected_doc":'3,4',
      "comment":'test'
    };
    var formData={};
    var data={formData:this.editDriverBusinessForm.value};
    this.driverUpdateData ={user,data,document};
    console.log(this.driverUpdateData);
    // update driver business details
    this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
       this.router.navigate(['/dashboard']);
      console.log(res);
      console.log('onUpdate');
      console.log(this.isEditModeOn);
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Business Details updated successfully');
    }, errorResponse => {
      console.log(errorResponse);
      this.toastr.error('Error', 'somthing went wrong');
    });

  }
}
