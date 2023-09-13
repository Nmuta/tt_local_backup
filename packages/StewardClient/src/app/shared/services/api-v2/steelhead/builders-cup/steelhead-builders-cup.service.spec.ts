import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadBuildersCupService } from './steelhead-builders-cup.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadConsolesService', () => {
  let service: SteelheadBuildersCupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadBuildersCupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
