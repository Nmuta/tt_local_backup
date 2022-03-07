import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ApiService, createMockApiService } from '@services/api';
import { of } from 'rxjs';
import faker from 'faker';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  let injector: TestBed;
  let service: CacheService;
  let apiServiceMock: ApiService;

  const basePath = 'v1/settings/cache';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    service = injector.inject(CacheService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getCacheKey$', () => {
    const key = faker.datatype.string(10);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call service.getRequest$', done => {
      service.getCacheKey$(key).subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(`${basePath}/${key}`);
        done();
      });
    });
  });

  describe('Method: deleteCacheKey$', () => {
    const key = faker.datatype.string(10);

    beforeEach(() => {
      apiServiceMock.deleteRequest$ = jasmine.createSpy('deleteRequest').and.returnValue(of({}));
    });

    it('should call service.deleteCacheKey$', done => {
      service.deleteCacheKey$(key).subscribe(() => {
        expect(apiServiceMock.deleteRequest$).toHaveBeenCalledWith(`${basePath}/${key}`);
        done();
      });
    });
  });
});
