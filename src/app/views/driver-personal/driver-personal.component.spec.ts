import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPersonalComponent } from './driver-personal.component';

describe('DriverPersonalComponent', () => {
  let component: DriverPersonalComponent;
  let fixture: ComponentFixture<DriverPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
