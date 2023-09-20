import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourStepComponent } from './tour-step.component';
import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('TourStepComponent', () => {
  let component: TourStepComponent;
  let fixture: ComponentFixture<TourStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [TourStepComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(TourStepComponent);
    component = fixture.componentInstance;
    component.step = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
