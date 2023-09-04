import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NbsLocationComponent } from './nbs-location.component';

describe('NbsLocationComponent', () => {
  let component: NbsLocationComponent;
  let fixture: ComponentFixture<NbsLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NbsLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NbsLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
