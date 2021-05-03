import { TestBed } from '@angular/core/testing';

import { ActivePipelineService } from './active-pipeline.service';

describe('ActivePipelineServiceService', () => {
  let service: ActivePipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivePipelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
