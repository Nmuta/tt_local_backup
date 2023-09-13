import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ExtractedModel } from '../helpers';
import { MODEL_DUMP_PROCESSED_MODEL$ } from '../model-dump.component';

import { ModelDumpImagesComponent } from './model-dump-images.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ModelDumpImagesComponent', () => {
  let component: ModelDumpImagesComponent;
  let fixture: ComponentFixture<ModelDumpImagesComponent>;
  const processedModel$ = new BehaviorSubject<ExtractedModel>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ModelDumpImagesComponent],
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
    fixture = TestBed.createComponent(ModelDumpImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
