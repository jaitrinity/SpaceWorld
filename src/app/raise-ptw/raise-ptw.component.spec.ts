import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisePtwComponent } from './raise-ptw.component';

describe('RaisePtwComponent', () => {
  let component: RaisePtwComponent;
  let fixture: ComponentFixture<RaisePtwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaisePtwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisePtwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
