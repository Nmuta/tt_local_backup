import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSpinnerComponent } from './error-spinner.component';

describe('ErrorSpinnerComponent', () => {
  let component: ErrorSpinnerComponent;
  let fixture: ComponentFixture<ErrorSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
