import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
 

  model: NgbDateStruct;
  date: {year: number, month: number};
  title = 'blogger';

  constructor(public commonService:CommonService,  private calendar: NgbCalendar) {}

  
  ngOnInit() {
    
  }
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  onToolbarMenuToggle(){
    this.commonService.toggleMenu();
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }
}

