import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }
    search_res : any = '';
    public search:any = '';
    locked: any[] = [];
    constructor(public commonService:CommonService) { }

  ngOnInit() {
    this.locked = [
      
      {Name: 'Rajesh Singh', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Rahul Rao', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Praveen Kumar ', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Rupali Ram ', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Female', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Purab Kadam', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Yagya Das', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Pramod Achari', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '08 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      
  ]
  }
  onToolbarMenuToggle(){
    console.log('toggle', this.commonService.isMenuOpen);
    this.commonService.toggleMenu();
  }
  private pageSize: number = 5;
  search_bt(query){
    this.search_res = query;
  }
  }


