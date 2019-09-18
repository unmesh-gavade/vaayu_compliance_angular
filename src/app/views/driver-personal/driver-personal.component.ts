import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass']
})
export class DriverPersonalComponent implements OnInit {
  zoom: number = 1.0;
  //pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  pdfsDocs:any[]=[];
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
  userRole:String;
  isDataENtry=false;
  selectedPage = 0;
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    //this.authService.checkLogin();
    const currentUser = this.authService.getAuthUser();
    this.userRole= currentUser.role;
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
     this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
  
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
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
        console.log(details);
        this.driverDetails = details['data']['user_detail'];
        this.pdfsDocs = details['data']['doc_list'];
        console.log('pDF without filter');
        console.log(this.pdfsDocs);
        this.pdfs = this.pdfsDocs.filter(item=> item.doc_url != null && item.doc_type ==='personal');  
        console.log('in pdfs');
        console.log('doc count = '+ this.pdfs.length);
        console.log(this.pdfs);
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
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
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
      let approvedDocsList = this.pdfs.filter(i => i.status === 'approved').map(item=>item.id);
      let rejectedDocsList= this.pdfs.filter(i => i.status === 'rejected').map(item=>item.id);
      var document={
        "approved_doc":approvedDocsList,
        "rejected_doc":rejectedDocsList,
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
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
   },errorResponse => {
       this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG)
   });  
   
    }
    saveDocsStatus(resource_id)
    {
      this.validateDocuments();
      this.onSubmit();
      // console.log(resource_id);
      this.router.navigate(['/driver-business' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
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
