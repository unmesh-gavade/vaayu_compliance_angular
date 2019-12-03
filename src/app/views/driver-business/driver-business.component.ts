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
  pdfs: any[] = [{doc_display_name:''}];
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
  CurentDateTime =new Date().toISOString();
  serverDateFormat = AppConst.SERVER_DATE_FORMAT;
  licence_expiry_date_model: Date
  induction_date_model: Date
  badge_issue_date_model: Date
  badge_expiry_date_model: Date
  is_renewal = 0;
  is_next = false;
  siteList = [];
  timeStart = {hour: 13, minute: 30};
  timeEnd = {hour: 13, minute: 30};
  public newTime:string='13:30';
  is_back = false;


  constructor(private formBuilder: FormBuilder, public driverService: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    //this.toastrService.overlayContainer = this.toastContainer;
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'qc_data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.is_renewal = <number><unknown>this.route.snapshot.paramMap.get("is_renewal");
    if (!this.is_renewal) {
      this.is_renewal = 0;
    }

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
      site_id: ['', Validators.required],
      shift_start_time:['',Validators.required],
      shift_end_time:['',Validators.required],
    });
    this.getSiteList();
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal),
    }
    this.driverPostData = { user };
    this.driverService.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
        console.log(details);
        this.driverDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null && item.doc_type === 'business');
  
        let date_of_registration = this.driverDetails[0]['date_of_registration'];
        let licence_validity = this.driverDetails[0]['licence_validity'];
        let badge_issue_date = this.driverDetails[0]['badge_issue_date'];
        let badge_expire_date = this.driverDetails[0]['badge_expire_date'];
        let shift_start_time= this.driverDetails[0]['shift_start_time']  ;
        let shift_end_time = this.driverDetails[0]['shift_end_time'];
        let splitStartTime= shift_start_time == null ? null: shift_start_time.split(':').map(parseFloat);
        let splitEndTime= shift_end_time== null ? null : shift_end_time.split(':').map(parseFloat);

        this.form.patchValue({
          licence_number: this.driverDetails[0]['licence_number'],
          licence_type: this.driverDetails[0]['licence_type'],
          licence_validity:  licence_validity == null ? null :  new Date(licence_validity),
          date_of_registration:  date_of_registration == null ? null :  new Date(date_of_registration),
          badge_number: this.driverDetails[0]['badge_number'],
          badge_issue_date:  badge_issue_date == null ? null :  new Date(badge_issue_date),
          badge_expire_date:  badge_expire_date == null ? null :  new Date(badge_expire_date),
          bank_name: this.driverDetails[0]['bank_name'],
          bank_no: this.driverDetails[0]['bank_no'],
          ifsc_code: this.driverDetails[0]['ifsc_code'],
          induction_status: this.driverDetails[0]['induction_status'],
          site_id: this.driverDetails[0]['site_id'],
          shift_start_time: shift_start_time == null ? this.timeStart : { hour:splitStartTime[0] , minute : splitStartTime[1] } ,
          shift_end_time: shift_end_time == null ? this.timeEnd : { hour:splitEndTime[0] , minute : splitEndTime[1] } , 
        });
        console.log(this.form.value);
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

    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if(rejected.length > 0){
     this.saveDetails();
    }
   else{
    if (this.form.invalid) {
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    else
    {
       this.saveDetails() ;
    }
   }   

   
  }
  saveDocsStatus(resource_id) {
    this.is_next = true;
    this.onSubmit();
    
  }
 
  backToPersonal(resource_id) {
    this.is_back = true;
    this.saveDetails();
    // this.router.navigate(['/driver-personal', { 'resource_id': resource_id, 'resource_type': 'drivers',
    // 'is_renewal': this.is_renewal }]);
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

  getFormattedDate(date) {
    //if (Object.prototype.toString.call(date) === "[object Date]") {
      if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }
  getSiteList() {
    this.driverService.getSiteList().subscribe(res => {
      this.siteList = res['data']['list'];
    });
  }
  saveDetails(){
    let shift_start_time = this.form.controls.shift_start_time.value ;
    let shift_end_time = this.form.controls.shift_end_time.value;
    
    this.form.controls.shift_start_time.setValue((moment(shift_start_time).format('HH:mm')) == 'Invalid date' ? '00:00': (moment(shift_start_time).format('HH:mm')) );
    this.form.controls.shift_end_time.setValue((moment(shift_end_time).format('HH:mm'))== 'Invalid date' ? '00:00': (moment(shift_end_time).format('HH:mm')) );
    
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal),
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
    console.log(this.driverUpdateData);
    // update driver business details
    this.driverService.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        if(this.is_next)
        {
          this.router.navigate(['/driver-document', { 'resource_id': this.resource_id, 'resource_type': 'drivers',
         'is_renewal': this.is_renewal }]);   
        }
        else if(this.is_back)
        {
          this.router.navigate(['/driver-personal', { 'resource_id': this.resource_id, 'resource_type': 'drivers',
          'is_renewal': this.is_renewal }]);
        }
        else
        {
          this.toastr.success('Success', 'Driver business details updated successfully');
        }
        // if(!this.is_next){
        // this.toastr.success('Success', 'Driver Business Details updated successfully');
        // }
        // this.router.navigate(['/driver-document', { 'resource_id': this.resource_id, 'resource_type': 'drivers',
        // 'is_renewal': this.is_renewal }]);
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });

  }
}
