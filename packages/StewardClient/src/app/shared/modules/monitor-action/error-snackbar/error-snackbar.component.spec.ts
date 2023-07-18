import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ActionMonitor } from '../action-monitor';

import { ErrorSnackbarComponent } from './error-snackbar.component';

describe('ErrorSnackbarComponent', () => {
  let component: ErrorSnackbarComponent;
  let fixture: ComponentFixture<ErrorSnackbarComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<unknown>>;

  beforeEach(async () => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
    await TestBed.configureTestingModule({
      declarations: [ErrorSnackbarComponent],
      imports: [MatSnackBarModule],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: new ActionMonitor('GET') },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSnackbarComponent);
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
