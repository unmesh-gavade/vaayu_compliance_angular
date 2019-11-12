import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { longStackSupport } from 'q';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor(private Auth: AuthService) { }
  userName : string; 
  ngOnInit() {
  const currentUser = this.Auth.getAuthUser();
  this.userName = (currentUser.f_name + ' ' + currentUser.l_name).toUpperCase();
  }
  logout()
  {
    this.Auth.logoutWithPop();
  }
}