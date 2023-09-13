import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteelheadBuildersCupSeriesCardComponent } from './steelhead-builders-cup-series-card.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadBuildersCupSeriesCardComponent', () => {
  let component: SteelheadBuildersCupSeriesCardComponent;
  let fixture: ComponentFixture<SteelheadBuildersCupSeriesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SteelheadBuildersCupSeriesCardComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadBuildersCupSeriesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
