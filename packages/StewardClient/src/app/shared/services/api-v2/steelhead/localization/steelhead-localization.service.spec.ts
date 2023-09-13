import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadLocalizationService } from './steelhead-localization.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadItemsService', () => {
  let service: SteelheadLocalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadLocalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
