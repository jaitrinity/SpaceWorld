import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePtwRaiserComponent } from './create-ptw-raiser.component';

describe('CreatePtwRaiserComponent', () => {
  let component: CreatePtwRaiserComponent;
  let fixture: ComponentFixture<CreatePtwRaiserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePtwRaiserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePtwRaiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
