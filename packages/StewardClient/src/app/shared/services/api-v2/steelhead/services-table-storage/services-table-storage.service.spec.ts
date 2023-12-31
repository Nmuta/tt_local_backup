import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadServicesTableStorageService } from './services-table-storage.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadConsolesService', () => {
  let service: SteelheadServicesTableStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(SteelheadServicesTableStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
