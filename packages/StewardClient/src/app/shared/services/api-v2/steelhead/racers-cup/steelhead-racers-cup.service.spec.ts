import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadRacersCupService } from './steelhead-racers-cup.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadConsolesService', () => {
  let service: SteelheadRacersCupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadRacersCupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
