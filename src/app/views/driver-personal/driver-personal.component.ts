import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as $ from 'jquery';
import { DriverService } from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { AppConst } from 'src/app/const/appConst';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DriverPersonalComponent implements OnInit {
  zoom: number = 1.0;
  //pdfSrc: string = './assets/images/myfile.pdf';
  pdfs = [];
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

  date_of_birth_model: Date

  is_renewal = 0;

  constructor(private formBuilder: FormBuilder, public driverService: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    //this.authService.checkLogin();
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
      driver_name: ['', Validators.required],
      father_spouse_name: ['', Validators.required],
      gender: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      marital_status: ['', Validators.required],
      aadhaar_mobile_number: ['', Validators.required],
      aadhar_number: ['', Validators.required],
      blood_group: ['', Validators.required],
      local_address: ['', Validators.required],
      permanent_address: ['', Validators.required],
      qualification: ['', Validators.required],
      induction_status: [''],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
    }
    this.driverPostData = { user };
    this.driverService.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
        
        this.driverDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null && item.doc_type === 'personal');

        let date_of_birth = this.driverDetails[0]['date_of_birth'];

        this.form.patchValue({
          driver_name: this.driverDetails[0]['driver_name'],
          father_spouse_name: this.driverDetails[0]['father_spouse_name'],
          gender: this.driverDetails[0]['gender'],
          date_of_birth:  date_of_birth == null ? null :  new Date(date_of_birth),
          marital_status: this.driverDetails[0]['marital_status'],
          aadhaar_mobile_number: this.driverDetails[0]['aadhaar_mobile_number'],
          aadhar_number: this.driverDetails[0]['aadhar_number'],
          blood_group: this.driverDetails[0]['blood_group'],
          local_address: this.driverDetails[0]['local_address'],
          permanent_address: this.driverDetails[0]['permanent_address'],
          qualification: this.driverDetails[0]['qualification'],
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
      console.log(values);
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    // this.form.patchValue({
    //   driver_name: values.driver_name,
    //   father_spouse_name: values.father_spouse_name,
    //   date_of_birth: moment(values.date_of_birth).format("YYYY-MM-DD"),
    //   gender: values.gender,
    //   aadhaar_mobile_number: values.aadhaar_mobile_number,
    //   aadhar_number: values.aadhar_number,
    //   marital_status: values.marital_status,
    //   blood_group: values.blood_group,
    //   local_address: values.local_address,
    //   permanent_address: values.permanent_address,
    //   qualification: values.qualification,
    //   induction_status: values.induction_status
    // });
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal)
    };
    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": 'test'
    };
    var data = { formData: this.form.value, document };
    this.driverUpdateData = { user, data };
    this.driverService.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Driver Personal Details updated successfully')
        this.router.navigate(['/driver-business', { 'resource_id': this.resource_id, 'resource_type': 'drivers', 
        'is_renewal': this.is_renewal }]);
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG)
    });

  }
  saveDocsStatus(resource_id) {
    //this.validateDocuments();
    this.onSubmit();
    
  }
  pageNumberButtonClicked(index) {
    this.selectedPage = index;
  }

  onPreviousButtonClick(e) {
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage - 1;
    }
  }

  onNextButtonClick(e) {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
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

  getFormattedDate(date) {
   // if (Object.prototype.toString.call(date) === "[object Date]") {
      if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
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
