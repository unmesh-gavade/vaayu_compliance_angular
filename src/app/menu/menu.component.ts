import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  constructor(public commonService:CommonService) { }
 
  ngOnInit() {
    
  }



  onToolbarMenuToggle(){
    this.commonService.toggleMenu();
  }

}