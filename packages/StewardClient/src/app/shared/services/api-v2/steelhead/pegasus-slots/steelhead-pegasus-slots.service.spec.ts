import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';
import { SteelheadPegasusSlotsService } from './steelhead-pegasus-slots.service';

describe('SteelheadPegasusSlotsService', () => {
  let service: SteelheadPegasusSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadPegasusSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
