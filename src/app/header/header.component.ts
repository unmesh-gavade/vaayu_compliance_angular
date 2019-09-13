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

  ngOnInit() {
    
  }
  logout()
  {
    this.Auth.logout();
  }
}