import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerUgcService } from './steelhead-player-ugc.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadPlayerUgcService', () => {
  let service: SteelheadPlayerUgcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerUgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
