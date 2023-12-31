﻿import { TestBed, getTestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconRegistryService } from './mat-icon-registry.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('service: MatIconRegistryService', () => {
  let injector: TestBed;
  let service: MatIconRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [],
        providers: [MatIconRegistryService],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    );

    injector = getTestBed();
    service = injector.inject(MatIconRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
