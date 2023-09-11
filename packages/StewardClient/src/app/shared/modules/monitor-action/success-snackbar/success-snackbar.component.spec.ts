import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule, MatLegacySnackBarRef as MatSnackBarRef, MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA } from '@angular/material/legacy-snack-bar';
import { ActionMonitor } from '../action-monitor';

import { SuccessSnackbarComponent } from './success-snackbar.component';

describe('SuccessSnackbarComponent', () => {
  let component: SuccessSnackbarComponent;
  let fixture: ComponentFixture<SuccessSnackbarComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<unknown>>;

  beforeEach(async () => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
    await TestBed.configureTestingModule({
      declarations: [SuccessSnackbarComponent],
      imports: [MatSnackBarModule],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: new ActionMonitor('GET') },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss', () => {
    component.onDismiss();
    expect(snackBarRefSpy.dismiss).toHaveBeenCalled();
  });

  it('should get label', () => {
    expect(component.label).toBe('GET');
  });
});
