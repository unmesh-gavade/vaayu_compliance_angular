import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { DriverService } from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConcatSource } from 'webpack-sources';
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-driver-business',
  templateUrl: './driver-business.component.html',
  styleUrls: ['./driver-business.component.sass']
})
export class DriverBusinessComponent implements OnInit {
  zoom: number = 1.0;
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
  resource_id:String;
  resource_type:String;
  userRole:String;
  isDataENtry=false;
  selectedPage = 0
  pdfsDocs:any[]=[];
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    //this.toastrService.overlayContainer = this.toastContainer;
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole= currentUser.role;
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
    
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
      "resource_id": + this.resource_id,
      "resource_type":this.resource_type,
      "os_type":'web'
   }
    this.driverPostData = { user };
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
      this.driverDetails = details['data']['user_detail'];
      this.pdfsDocs = details['data']['doc_list'];
      this.pdfs = this.pdfsDocs.filter(item=> item.doc_url != null && item.doc_type ==='business');  
      console.log(details);
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
    }
    else
    {
      this.toastr.error('Error', 'Something Went Wrong.');
    }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });
  }

 
  incrementZoom(amount: number) {
    this.zoom += amount;   }
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
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    let approvedDocsList = this.pdfs.filter(i => i.status === 'approved').map(item=>item.id);
      let rejectedDocsList= this.pdfs.filter(i => i.status === 'rejected').map(item=>item.id);
      var document={
        "approved_doc":approvedDocsList,
        "rejected_doc":rejectedDocsList,
        "comment":'test'
      };
    var formData={};
    var data={formData:this.editDriverBusinessForm.value,document};
    this.driverUpdateData ={user,data};
    console.log(this.driverUpdateData);
    // update driver business details
    this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
      console.log(res);
      console.log('onUpdate');
      console.log(this.isEditModeOn);
      this.isEditModeOn=false;
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Business Details updated successfully');
      }
      else{
        this.toastr.error('Error',AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      console.log(errorResponse);
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });

  }
  saveDocsStatus(resource_id)
    {
      this.validateDocuments();
      this.onSubmit();
      this.router.navigate(['/driver-document' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
    }
    pageNumberButtonClicked(index) {
      console.log('page number = '+ index);
      this.selectedPage = index; 
    }
  
    onPreviousButtonClick () { 
      if (this.selectedPage > 0) {
        this.selectedPage = this.selectedPage-1;
      } 
      console.log('page number = '+ this.selectedPage);
    }
  
    onNextButtonClick () { 
      if (this.selectedPage < this.pdfs.length-1) {
        this.selectedPage = this.selectedPage+1;
      } 
      console.log('page number = '+ this.selectedPage);
    }
    backToPersonal(resource_id)
    {
      console.log(resource_id);
      this.router.navigate(['/driver-personal' ,{'resource_id':resource_id,'resource_type':'drivers' }]);  
    }
    validateDocuments()
   {
    let array = this.pdfs.filter(i => i.status === 'none')
    console.log(array);
    let docsName = '';
    array.map(i => {
      docsName += i.doc_display_name + "- ";
    })
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: '+ docsName);
      return false;
    }
    return true;
   }
}
