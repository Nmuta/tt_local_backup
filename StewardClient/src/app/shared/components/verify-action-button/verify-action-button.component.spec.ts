import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { defer } from 'rxjs';

import { VerifyActionButtonComponent } from './verify-action-button.component';

describe('VerifyActionButtonComponent', () => {
  let component: VerifyActionButtonComponent;
  let fixture: ComponentFixture<VerifyActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyActionButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset', () => {
    component.verified = true;
    component.reset();
    expect(component.verified).toBeFalsy();
  });

  it('should perform action', (done) => {
    component.verified = true;
    component.action = () => defer(() => {
      expect(component.verified).toBeTruthy();
      expect(component.isSubmitting).toBeTruthy();
      done();
    })

    component.doAction();
  });
});
