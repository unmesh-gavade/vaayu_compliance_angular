import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBusinessComponent } from './driver-business.component';

describe('DriverBusinessComponent', () => {
  let component: DriverBusinessComponent;
  let fixture: ComponentFixture<DriverBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
