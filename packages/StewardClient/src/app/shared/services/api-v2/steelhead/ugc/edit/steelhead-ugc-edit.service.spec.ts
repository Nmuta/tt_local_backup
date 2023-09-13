import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SteelheadUgcEditService } from './steelhead-ugc-edit.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadUgcEditService', () => {
  let service: SteelheadUgcEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SteelheadUgcEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
