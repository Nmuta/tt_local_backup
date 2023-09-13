import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockServicesTableStorageService } from './services-table-storage.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockServicesTableStorageService', () => {
  let service: WoodstockServicesTableStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockServicesTableStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
