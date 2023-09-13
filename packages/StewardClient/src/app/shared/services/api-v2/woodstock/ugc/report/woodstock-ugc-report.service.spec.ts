import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockUgcReportService } from './woodstock-ugc-report.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('FindService', () => {
  let service: WoodstockUgcReportService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
      }),
    );
    service = TestBed.inject(WoodstockUgcReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
