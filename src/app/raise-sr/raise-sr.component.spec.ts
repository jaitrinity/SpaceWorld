import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseSrComponent } from './raise-sr.component';

describe('RaiseSrComponent', () => {
  let component: RaiseSrComponent;
  let fixture: ComponentFixture<RaiseSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
