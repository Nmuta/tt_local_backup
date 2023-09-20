import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineSpinnerComponent } from './inline-spinner.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('InlineSpinnerComponent', () => {
  let component: InlineSpinnerComponent;
  let fixture: ComponentFixture<InlineSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [InlineSpinnerComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
