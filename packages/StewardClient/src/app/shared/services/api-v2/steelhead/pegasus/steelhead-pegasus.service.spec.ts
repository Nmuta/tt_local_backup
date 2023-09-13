import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPegasusService } from './steelhead-pegasus.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPegasusService', () => {
  let service: SteelheadPegasusService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPegasusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
