import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpPriceTableComponent } from './model-dump-price-table.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpPriceTableComponent', () => {
  let component: ModelDumpPriceTableComponent;
  let fixture: ComponentFixture<ModelDumpPriceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpPriceTableComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpPriceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
