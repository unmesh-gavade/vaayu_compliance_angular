import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error: {};
  loginError: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
   ) { }

  ngOnInit() {

     //let EmailPattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'

    this.loginForm = this.formBuilder.group({
      // username: ['qc-n3wnormal-com', Validators.required],
      // password: ['password3', Validators.required]
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }
    this.authService.login(this.username.value, this.password.value).subscribe((data) => {
       if (this.authService.isLoggedIn) {
         //this.authService.ValidateToken().subscribe((authData) => {
            //const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/dashboard';
            //this.router.navigate([redirect]);
            this.router.navigate(['/dashboard']);
            this.toastr.success('Success', 'Logged In Successfully');
         //});
        } else {
          this.toastr.error('Error','Username or password is incorrect.');
          this.loginError = 'Username or password is incorrect.';
        }
      },
      errorResponse => {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      });
  }
}
