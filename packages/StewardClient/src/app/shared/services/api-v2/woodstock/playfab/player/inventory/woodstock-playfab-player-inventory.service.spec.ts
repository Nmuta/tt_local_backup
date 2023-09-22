import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayFabPlayerInventoryService } from './woodstock-playfab-player-inventory.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayFabPlayerInventoryService', () => {
  let service: WoodstockPlayFabPlayerInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockPlayFabPlayerInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
