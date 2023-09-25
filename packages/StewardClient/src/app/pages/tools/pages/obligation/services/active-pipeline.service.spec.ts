import { TestBed } from '@angular/core/testing';

import { ActivePipelineService } from './active-pipeline.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ActivePipelineServiceService', () => {
  let service: ActivePipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule(createStandardTestModuleMetadataMinimal({}));
    service = TestBed.inject(ActivePipelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
