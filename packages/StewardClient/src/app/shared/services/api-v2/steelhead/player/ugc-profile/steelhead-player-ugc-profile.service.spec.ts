import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPlayerUgcProfileService } from './steelhead-player-ugc-profile.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadPlayerUgcProfileService', () => {
  let service: SteelheadPlayerUgcProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPlayerUgcProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
