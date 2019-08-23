import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePersonalComponent } from './vehicle-personal.component';

describe('VehiclePersonalComponent', () => {
  let component: VehiclePersonalComponent;
  let fixture: ComponentFixture<VehiclePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
