import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { CommonService } from  '../../services/common.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {

  model: NgbDateStruct;
  date: {year: number, month: number};
  title = 'blogger';
  constructor(public commonService:CommonService, private mScrollbarService: MalihuScrollbarService, private calendar: NgbCalendar) {}

  ngOnInit() {
    this.mScrollbarService.initScrollbar(document.body, { axis: 'yx', theme: 'minimal-dark' });
  }
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  onToolbarMenuToggle(){
    console.log('toggle', this.commonService.isMenuOpen);
    this.commonService.toggleMenu();
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }
}
