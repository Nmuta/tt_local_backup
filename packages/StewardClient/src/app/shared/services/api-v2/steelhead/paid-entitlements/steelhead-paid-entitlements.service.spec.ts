import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadPaidEntitlementsService } from './steelhead-paid-entitlements.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadPaidEntitlementsService', () => {
  let service: SteelheadPaidEntitlementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadPaidEntitlementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
