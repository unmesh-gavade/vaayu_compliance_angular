import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { VehicleService } from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConst } from 'src/app/const/appConst';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-vehicle-business',
  templateUrl: './vehicle-personal.component.html',
  styleUrls: ['./vehicle-personal.component.sass'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class VehiclePersonalComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL = "./assets/img/Doc.jpg";
  form: FormGroup;
  submitted = false;
  vehicleDetails: object;
  vehiclePostData: {};
  vehicleUpdateData: {};
  resource_id: String;
  resource_type: String;
  userRole: String;
  isDataENtry = false;
  selectedPage = 0;
  pdfsDocs: any[] = [];

  manufacturing_date_model: Date
  registration_date_model: Date
  insurance_date_model: Date
  puc_date_model: Date
  fitness_date_model: Date
  permit_date_model: Date

  serverDateFormat = AppConst.SERVER_DATE_FORMAT;
  is_renewal = 0;

  constructor(private formBuilder: FormBuilder, public apiService: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");

    this.is_renewal = <number><unknown>this.route.snapshot.paramMap.get("is_renewal");
    if (!this.is_renewal) {
      this.is_renewal = 0;
    }

    this.form = this.formBuilder.group({
      plate_number: ['', Validators.required],
      category: ['', Validators.required],
      model: ['', Validators.required],
      seats: ['', Validators.required],
      colour: ['', Validators.required],
      make_year: ['', Validators.required],
      registration_date: ['', Validators.required],
      insurance_date: ['', Validators.required],
      puc_validity_date: ['', Validators.required],
      fitness_validity_date: ['', Validators.required],
      permit_validity_date: ['', Validators.required],
      ac: ['', Validators.required],
      fuel_type: ['', Validators.required],
      // induction_status: [''],

    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
    }
    this.vehiclePostData = { user };

    this.apiService.getVehicleDetails(this.vehiclePostData).subscribe(details => {
      if (details['success'] == true) {

        this.vehicleDetails = details['data']['user_detail'];
        
        this.pdfsDocs = details['data']['doc_list'];
        this.pdfs = this.pdfsDocs.filter(item => item.doc_url != null && item.doc_type === 'business');
        this.form.patchValue({
          plate_number: this.vehicleDetails[0]['plate_number'],
          category: this.vehicleDetails[0]['category'],
          model: this.vehicleDetails[0]['model'],
          seats: this.vehicleDetails[0]['seats'],
          colour: this.vehicleDetails[0]['colour'],

          make_year: new Date(this.vehicleDetails[0]['make_year']),
          registration_date: new Date(this.vehicleDetails[0]['registration_date']),
          insurance_date: new Date(this.vehicleDetails[0]['insurance_date']),
          puc_validity_date: new Date(this.vehicleDetails[0]['puc_validity_date']),
          fitness_validity_date: new Date(this.vehicleDetails[0]['fitness_validity_date']),
          permit_validity_date: new Date(this.vehicleDetails[0]['permit_validity_date']),
          ac: this.vehicleDetails[0]['ac'],
          fuel_type: this.vehicleDetails[0]['fuel_type'],
          // induction_status: this.vehicleDetails[0]['induction_status']
        });
      }
      else {
        this.toastr.error('Error', 'Something Went Wrong.');
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });
  }
  incrementZoom(amount: number) {
    this.zoom += amount;
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
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    var values = this.form.value;

    if (this.form.invalid) {
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }

    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
    };
    
    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": 'test'
    };
    var data = { formData: this.form.value, document };
    this.vehicleUpdateData = { user, data };
    // update vehicle personal details
    this.apiService.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      if (res['success'] === true) {
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Vehicle Personal Details updated successfully');
        this.router.navigate(['/vehicle-document', { 'resource_id': this.resource_id, 'resource_type': 'vehicles',
        'is_renewal': this.is_renewal }]);
      }
      else {
        this.toastr.error('Error', res['message']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });

  }
  saveDocsStatus(resource_id) {
    this.onSubmit();
    //this.router.navigate(['/vehicle-document', { 'resource_id': resource_id, 'resource_type': 'vehicles' }]);
  }


  pageNumberButtonClicked(index) {
    this.selectedPage = index;
  }

  onPreviousButtonClick() {
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage - 1;
    }
  }

  onNextButtonClick() {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
  }

  check_if_doc_is_pdf(docUrl) {
    if (docUrl.includes('.pdf')) {
      return true;
    } else {
      return false;
    }
  }

  

  print(arg) {
  }

  getFormattedDate(date) {
    if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }


}
