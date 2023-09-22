import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcHideStatusService } from './woodstock-ugc-hide-status.service';
import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockUgcHideStatusService', () => {
  let service: WoodstockUgcHideStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockUgcHideStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
