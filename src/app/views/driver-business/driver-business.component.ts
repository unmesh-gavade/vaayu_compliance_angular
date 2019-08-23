import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-driver-business',
  templateUrl: './driver-business.component.html',
  styleUrls: ['./driver-business.component.sass']
})
export class DriverBusinessComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverBusinessForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editDriverBusinessForm = this.formBuilder.group({
      txtTermsOfService: [''],
      txtBusinessState: [''],
      txtBusinessCity: [''],
      txtBankName: [''],
      txtBankAccNo: [''],
      txtIFSCCode:[''],
      txtBloodGroup:[''],
      txtDriverAcc:[''],
      txtLicenceNo: ['', Validators.required],
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
  get f() { return this.editDriverBusinessForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverBusinessForm.value;
    // stop here if form is invalid
    if (this.editDriverBusinessForm.invalid) {
    
        return;
    }
  }
}
