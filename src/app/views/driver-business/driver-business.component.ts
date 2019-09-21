import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { DriverService } from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConcatSource } from 'webpack-sources';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { AppConst } from 'src/app/const/appConst';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-driver-business',
  templateUrl: './driver-business.component.html',
  styleUrls: ['./driver-business.component.sass'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DriverBusinessComponent implements OnInit {
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
  selectedPage = 0

  serverDateFormat = AppConst.SERVER_DATE_FORMAT;
  licence_expiry_date_model: Date
  induction_date_model: Date
  badge_issue_date_model: Date
  badge_expiry_date_model: Date

  constructor(private formBuilder: FormBuilder, public driverService: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    //this.toastrService.overlayContainer = this.toastContainer;
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.form = this.formBuilder.group({
      licence_number: ['', Validators.required],
      licence_type: ['', Validators.required],
      licence_validity: ['', Validators.required],
      date_of_registration: ['', Validators.required],
      badge_number: ['', Validators.required],
      badge_issue_date: ['', Validators.required],
      badge_expire_date: ['', Validators.required],
      bank_name: ['', Validators.required],
      bank_no: ['', Validators.required],
      ifsc_code: ['', Validators.required],
      induction_status: ['', ''],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    }
    this.driverPostData = { user };
    this.driverService.getDriverDetails(this.driverPostData).subscribe(details => {
      // console.log(JSON.stringify(details));
      if (details['success'] == true) {
        this.driverDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null && item.doc_type === 'business');
        
  
        this.form.patchValue({
          licence_number: this.driverDetails[0]['licence_number'],
          licence_type: this.driverDetails[0]['licence_type'],
          licence_validity: new Date(this.driverDetails[0]['licence_validity']),
          date_of_registration: new Date(this.driverDetails[0]['date_of_registration']),
          badge_number: this.driverDetails[0]['badge_number'],
          badge_issue_date: new Date(this.driverDetails[0]['badge_issue_date']),
          badge_expire_date: new Date(this.driverDetails[0]['badge_expire_date']),
          bank_name: this.driverDetails[0]['bank_name'],
          bank_no: this.driverDetails[0]['bank_no'],
          ifsc_code: this.driverDetails[0]['ifsc_code'],
          induction_status: this.driverDetails[0]['induction_status']
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
    let approvedDocsId = this.pdfs.filter(i => i.status === 'approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'rejected').map(item => item.id).join(",");
    console.log('approvedDocsId = ' + JSON.stringify(approvedDocsId));
    console.log('rejectedDocsId = '+JSON.stringify(rejectedDocsId));
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": 'test'
    };
    var data = { formData: this.form.value, document };
    this.driverUpdateData = { user, data };
    console.log(this.driverUpdateData);
    // update driver business details
    this.driverService.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
        console.log(res);
        console.log('onUpdate');
        console.log(this.isEditModeOn);
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Driver Business Details updated successfully');
        this.router.navigate(['/driver-document', { 'resource_id': this.resource_id, 'resource_type': 'drivers' }]);
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });

  }
  saveDocsStatus(resource_id) {
    // this.validateDocuments();
    this.onSubmit();
    
  }
 
  backToPersonal(resource_id) {
    console.log(resource_id);
    this.router.navigate(['/driver-personal', { 'resource_id': resource_id, 'resource_type': 'drivers' }]);
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
    console.log(array);
    let docsName = '';
    array.map(i => {
      docsName += i.doc_display_name + "- ";
    })
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ' + docsName);
      return false;
    }
    return true;
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
      if (docUrl.includes('.pdf')) {
        return true;
      } else {
        return false;
      }
    }
  }

  getFormattedDate(date) {
    if (date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }
}
