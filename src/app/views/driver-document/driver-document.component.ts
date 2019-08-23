import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.sass']
})
export class DriverDocumentComponent implements OnInit {
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverDocumentForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editDriverDocumentForm = this.formBuilder.group({
      txtPoliceVerification: [''],
      txtPoliceVerificationValidity: [''],
      txtDateOfPoliceVeri: [''],
      txtCriminalOffense: [''],
      txtBGCDate:[''],
      txtBGCAgency:[''],
      txtMedicalCertifiedDate:[''],
      txtSexualHarr: ['', Validators.required],
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
   get f() { return this.editDriverDocumentForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverDocumentForm.value;
    // stop here if form is invalid
    if (this.editDriverDocumentForm.invalid) {
    
        return;
    }
  }
}
