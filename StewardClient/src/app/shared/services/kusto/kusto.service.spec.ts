import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Unprocessed } from '@models/unprocessed';
import { createMockApiService } from '@services/api';
import { KustoService } from './kusto.service';

describe('KustoService', () => {
  let injector: TestBed;
  let service: KustoService;

  // let apiServiceMock: ApiService;
  const nextReturnValue: Unprocessed<unknown> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(KustoService);
    // apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
