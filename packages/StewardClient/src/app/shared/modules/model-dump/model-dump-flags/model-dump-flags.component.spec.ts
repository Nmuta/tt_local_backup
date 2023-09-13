import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ExtractedModel } from '../helpers';
import { MODEL_DUMP_PROCESSED_MODEL$ } from '../model-dump.component';

import { ModelDumpFlagsComponent } from './model-dump-flags.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpFlagsComponent', () => {
  let component: ModelDumpFlagsComponent;
  let fixture: ComponentFixture<ModelDumpFlagsComponent>;
  const processedModel$ = new BehaviorSubject<ExtractedModel>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpFlagsComponent],
        providers: [
          {
            provide: MODEL_DUMP_PROCESSED_MODEL$,
            useValue: processedModel$,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
