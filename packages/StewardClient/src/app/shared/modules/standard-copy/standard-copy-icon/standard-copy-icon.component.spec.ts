import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { StandardCopyIconComponent } from './standard-copy-icon.component';

/** Test harness component for standard copy component. */
@Component({
  template: '<standard-copy>test</standard-copy>',
})
class TestHarnessComponent {}

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('StandardCopyIconComponent', () => {
  let component: StandardCopyIconComponent;
  let fixture: ComponentFixture<StandardCopyIconComponent>;
  let harness: ComponentFixture<TestHarnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [TestHarnessComponent, StandardCopyIconComponent],
        imports: [MatTooltipModule],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardCopyIconComponent);
    component = fixture.componentInstance;
    harness = TestBed.createComponent(TestHarnessComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
