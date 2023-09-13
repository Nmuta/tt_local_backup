import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpHumanizeTableComponent } from './model-dump-humanize-table.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpHumanizeTableComponent', () => {
  let component: ModelDumpHumanizeTableComponent;
  let fixture: ComponentFixture<ModelDumpHumanizeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpHumanizeTableComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpHumanizeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
