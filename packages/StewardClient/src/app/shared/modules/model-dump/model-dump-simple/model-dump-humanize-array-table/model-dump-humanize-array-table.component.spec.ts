import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpHumanizeArrayTableComponent } from './model-dump-humanize-array-table.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ModelDumpHumanizeArrayTableComponent', () => {
  let component: ModelDumpHumanizeArrayTableComponent;
  let fixture: ComponentFixture<ModelDumpHumanizeArrayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpHumanizeArrayTableComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpHumanizeArrayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
