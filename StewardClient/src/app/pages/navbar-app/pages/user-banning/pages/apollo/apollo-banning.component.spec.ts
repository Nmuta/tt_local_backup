import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloBanningComponent } from './apollo-banning.component';

describe('ApolloBanningComponent', () => {
  let component: ApolloBanningComponent;
  let fixture: ComponentFixture<ApolloBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApolloBanningComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submit();
  });
});
