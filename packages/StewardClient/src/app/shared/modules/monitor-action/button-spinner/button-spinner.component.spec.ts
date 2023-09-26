import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ActionMonitor } from '../action-monitor';

import { ButtonSpinnerComponent } from './button-spinner.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ButtonSpinnerComponent', () => {
  let component: ButtonSpinnerComponent;
  let fixture: ComponentFixture<ButtonSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ButtonSpinnerComponent],
        imports: [MatSnackBarModule],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSpinnerComponent);
    component = fixture.componentInstance;
    component.monitor = new ActionMonitor();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
