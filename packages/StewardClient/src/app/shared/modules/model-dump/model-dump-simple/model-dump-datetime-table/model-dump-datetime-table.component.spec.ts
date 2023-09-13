import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpDatetimeTableComponent } from './model-dump-datetime-table.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpDatetimeTableComponent', () => {
  let component: ModelDumpDatetimeTableComponent;
  let fixture: ComponentFixture<ModelDumpDatetimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpDatetimeTableComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpDatetimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
