import { ComponentFixture, TestBed } from '@angular/core/testing';
import BigNumber from 'bignumber.js';

import { ModelDumpComponent } from './model-dump.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpComponent', () => {
  let component: ModelDumpComponent;
  let fixture: ComponentFixture<ModelDumpComponent>;
  const inputModel = {
    one: new BigNumber(42),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpComponent);
    component = fixture.componentInstance;
    component.model = inputModel;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process', () => {
    component.ngOnChanges();
    expect(component.processedModel).toBeTruthy();
  });
});
