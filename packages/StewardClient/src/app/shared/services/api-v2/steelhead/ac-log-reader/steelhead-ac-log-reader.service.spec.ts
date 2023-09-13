import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadAcLogReaderService } from './steelhead-ac-log-reader.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadAcLogReaderService', () => {
  let service: SteelheadAcLogReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadAcLogReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
