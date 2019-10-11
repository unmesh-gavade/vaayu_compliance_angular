import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { DriverService } from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConst } from 'src/app/const/appConst';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.sass'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DriverDocumentComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL = "./assets/img/Doc.jpg";
  form: FormGroup;
  submitted = false;
  driverDetails: object;
  driverPostData: {};
  driverUpdateData: {};
  resource_id: String;
  resource_type: String;
  userRole: String;
  isDataENtry = false;
  selectedPage = 0;

  serverDateFormat = AppConst.SERVER_DATE_FORMAT;
  police_verification_vailidty_model: Date
  date_of_police_verification_model: Date
  bgc_date_model: Date
  medically_certified_date_model: Date
  is_renewal = 0;
  nevigateToDash = false;

  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.is_renewal = <number><unknown>this.route.snapshot.paramMap.get("is_renewal");
    console.log('is renew ' + this.is_renewal);
    if (!this.is_renewal) {
      this.is_renewal = 0;
    }

    this.form = this.formBuilder.group({
      verified_by_police: ['', Validators.required],
      police_verification_vailidty: ['', Validators.required],
      date_of_police_verification: ['', Validators.required],
      criminal_offence: ['', Validators.required],
      bgc_date: ['', Validators.required],
      bgc_agency_id: ['', Validators.required],
      medically_certified_date: ['', Validators.required],
      sexual_policy: ['', Validators.required],
      induction_status: [''],
      comment: ['',''],
    });
    
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal),
    }
    this.driverPostData = { user };
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
        console.log(details);
        this.driverDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null);

        let police_verification_vailidty = this.driverDetails[0]['police_verification_vailidty'];
        let date_of_police_verification = this.driverDetails[0]['date_of_police_verification'];
        let bgc_date = this.driverDetails[0]['bgc_date'];
        let medically_certified_date = this.driverDetails[0]['medically_certified_date'];

        this.form.patchValue({
          verified_by_police: this.driverDetails[0]['verified_by_police'],
          police_verification_vailidty:police_verification_vailidty == null ? null :  new Date(police_verification_vailidty),
          date_of_police_verification: date_of_police_verification == null ? null :  new Date(date_of_police_verification),
          criminal_offence: this.driverDetails[0]['criminal_offence'],
          bgc_date: bgc_date == null ? null :  new Date(bgc_date),
          bgc_agency_id: this.driverDetails[0]['bgc_agency_id'],
          medically_certified_date:medically_certified_date == null ? null :  new Date(medically_certified_date),
          sexual_policy: this.driverDetails[0]['sexual_policy'],
          induction_status: this.driverDetails[0]['induction_status'],
          comment: this.driverDetails[0]['comment']
        });
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
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
   console.log(values);
    // stop here if form is invalid
    if (this.form.invalid) {
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal),
    };
    console.log(this.pdfs.filter(i => i.status === 'Approved'));

    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": this.form.controls.comment.value
    };
    var data = { formData: this.form.value, document };
    this.driverUpdateData = { user, data };
    console.log(this.driverUpdateData);
    // update driver Documents details
    this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Driver Documents submitted successfully');
        if(this.nevigateToDash){
          this.router.navigate(['/dashboard']);
        }
      }
      else {
        this.toastr.error('Error', res['errors']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });
  }
  backToPersonal(resource_id) {
    this.router.navigate(['/driver-business', { 'resource_id': resource_id, 'resource_type': 'drivers',
    'is_renewal': this.is_renewal }]);
  }
  
  sumbitDriver() {
    if (this.validateDocuments()) {
      this.nevigateToDash = true;
      this.onSubmit();
    }
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ');
      return false;
    } 
     if (rejected.length > 0) {
      this.form.patchValue({
        induction_status: 'Rejected'
      });
      if (this.form.controls.comment.value == 'null') {
        this.toastr.error('Error', 'Select Rejection Reason');
        return false;
      }
      return true;
    }
    else {
      this.form.patchValue({
        induction_status: 'Approved'
      });
    }
    return true;
  }
  getFormattedDate(date) {
    //if (Object.prototype.toString.call(date) === "[object Date]") {
      if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
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
  check_if_doc_is_pdf() {
    if (this.pdfs.length > this.selectedPage) {
      let docUrl = this.pdfs[this.selectedPage].doc_url
      if (docUrl && docUrl.includes('.pdf')) {
        return true;
      } else {
        return false;
      }
    }
  }

}
