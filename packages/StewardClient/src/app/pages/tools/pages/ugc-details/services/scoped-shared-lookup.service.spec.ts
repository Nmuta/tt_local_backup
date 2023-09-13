import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ScopedSharedLookupService } from './scoped-shared-lookup.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ScopedSharedLookupService', () => {
  let service: ScopedSharedLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule],
        providers: [ScopedSharedLookupService],
      }),
    );
    service = TestBed.inject(ScopedSharedLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
