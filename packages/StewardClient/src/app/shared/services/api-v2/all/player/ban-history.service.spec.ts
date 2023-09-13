import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MultipleBanHistoryService } from './ban-history.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'MultipleBanHistoryService', () => {
  let service: MultipleBanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MultipleBanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
