import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockPlayFabBuildsService } from './woodstock-playfab-builds.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockPlayFabBuildsService', () => {
  let service: WoodstockPlayFabBuildsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WoodstockPlayFabBuildsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
