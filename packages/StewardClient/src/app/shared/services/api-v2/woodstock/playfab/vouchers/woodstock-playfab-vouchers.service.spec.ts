import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayFabVouchersService } from './woodstock-playfab-vouchers.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockPlayFabVouchersService', () => {
  let service: WoodstockPlayFabVouchersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayFabVouchersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
