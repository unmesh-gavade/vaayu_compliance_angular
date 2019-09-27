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

  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.form = this.formBuilder.group({
      verified_by_police: ['', ''],
      police_verification_vailidty: ['', Validators.required],
      date_of_police_verification: ['', Validators.required],
      criminal_offence: ['', Validators.required],
      bgc_date: ['', Validators.required],
      bgc_agency_id: ['', Validators.required],
      medically_certified_date: ['', Validators.required],
      sexual_policy: ['', Validators.required],
      induction_status: [''],
      comment: [null],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    }
    this.driverPostData = { user };
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      console.log(details);
      if (details['success'] == true) {
        this.driverDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null);

        this.form.patchValue({
          verified_by_police: this.driverDetails[0]['verified_by_police'],
          police_verification_vailidty:new Date(this.driverDetails[0]['police_verification_vailidty']),
          date_of_police_verification: new Date(this.driverDetails[0]['date_of_police_verification']) ,
          criminal_offence: this.driverDetails[0]['criminal_offence'],
          bgc_date: new Date(this.driverDetails[0]['bgc_date']) ,
          bgc_agency_id: this.driverDetails[0]['bgc_agency_id'],
          medically_certified_date: new Date(this.driverDetails[0]['medically_certified_date']) ,
          sexual_policy: this.driverDetails[0]['sexual_policy'],
          induction_status: this.driverDetails[0]['induction_status']
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
    // stop here if form is invalid
    if (this.form.invalid) {
      console.log('form is invalid')
      console.log(this.form.controls)
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    console.log('approvedDocsId = ' + JSON.stringify(approvedDocsId));
    console.log('rejectedDocsId = '+JSON.stringify(rejectedDocsId));
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
        console.log(this.isEditModeOn);
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Driver Documents Details updated successfully');
      }
      else {
        console.log(res);
        this.toastr.error('Error', res['errors']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });
  }
  backToPersonal(resource_id) {
    console.log(resource_id);
    this.router.navigate(['/driver-business', { 'resource_id': resource_id, 'resource_type': 'drivers' }]);
  }
  // saveDocsStatus(resource_id)
  // {
  //   this.validateDocuments();
  //   this.onSubmit();
  //   this.router.navigate(['/driver-document' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
  // }
  
  sumbitDriver() {
    if (this.validateDocuments()) {
      this.onSubmit();
    }
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ');
      return false;
    } else if (rejected.length > 0 && this.form.controls.comment.invalid) {
      this.toastr.error('Error', 'Select Rejection Reason');
      this.form.patchValue({
        induction_status: 'Rejected'
      });
      return false;
    } else {
      this.form.patchValue({
        induction_status: 'Approved'
      });
    }
    return true;
  }
  getFormattedDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
    //if (date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }

  pageNumberButtonClicked(index) {
    console.log('page number = ' + index);
    this.selectedPage = index;
  }

  onPreviousButtonClick() {
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage - 1;
    }
    console.log('page number = ' + this.selectedPage);
  }

  onNextButtonClick() {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
    console.log('page number = ' + this.selectedPage);
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
