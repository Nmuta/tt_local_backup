import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyActionButtonComponent } from './verify-action-button.component';

describe('VerifyActionButtonComponent', () => {
  let component: VerifyActionButtonComponent;
  let fixture: ComponentFixture<VerifyActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyActionButtonComponent],
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
});
