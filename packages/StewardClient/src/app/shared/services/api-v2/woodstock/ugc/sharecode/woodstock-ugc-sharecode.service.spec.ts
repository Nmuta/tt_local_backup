import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcSharecodeService } from './woodstock-ugc-sharecode.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockUgcSharecodeService', () => {
  let service: WoodstockUgcSharecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockUgcSharecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
