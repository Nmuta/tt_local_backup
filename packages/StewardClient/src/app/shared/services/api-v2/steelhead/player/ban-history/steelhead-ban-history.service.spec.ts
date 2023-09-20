import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadBanHistoryService } from './steelhead-ban-history.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadBanHistoryService', () => {
  let service: SteelheadBanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadBanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
