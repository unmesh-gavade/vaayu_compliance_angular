import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBusinessComponent } from './vehicle-business.component';

describe('VehicleBusinessComponent', () => {
  let component: VehicleBusinessComponent;
  let fixture: ComponentFixture<VehicleBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
