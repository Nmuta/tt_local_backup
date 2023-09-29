import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpDurationTableComponent } from './model-dump-duration-table.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ModelDumpDurationTableComponent', () => {
  let component: ModelDumpDurationTableComponent;
  let fixture: ComponentFixture<ModelDumpDurationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpDurationTableComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpDurationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
