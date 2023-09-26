import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayerUgcService } from './woodstock-player-ugc.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayerUgcService', () => {
  let service: WoodstockPlayerUgcService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockPlayerUgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
