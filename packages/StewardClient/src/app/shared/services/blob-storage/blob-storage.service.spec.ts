import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService, createMockApiService } from '@services/api';
import { BlobStorageService } from '.';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('BlobStorageService', () => {
  let injector: TestBed;
  let service: BlobStorageService;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let apiServiceMock: ApiService;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        providers: [createMockApiService(() => nextReturnValue)],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    );

    injector = getTestBed();
    service = injector.inject(BlobStorageService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
