import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BigintInterceptor } from './bigint.interceptor';

describe('BigintInterceptor', () => {
  let interceptor: BigintInterceptor;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  const testUrl = 'http://localhost/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BigintInterceptor],
    });

    interceptor = TestBed.inject(BigintInterceptor);
    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('dry run:', () => {
    beforeEach(() => {
      interceptor.handle = jasmine.createSpy('handle');
    });

    it('skips non-json', () => {
      interceptor.handle = jasmine.createSpy('handle');
      http.get(testUrl, { responseType: 'text' })
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.responseType).toBe('text');
      expect(interceptor.handle).toHaveBeenCalledTimes(0);
    });
  
    it('handles json', () => {
      interceptor.handle = jasmine.createSpy('handle');
      http.get(testUrl, { responseType: 'json' })
      const httpRequest = httpMock.expectOne(testUrl);
      expect(httpRequest.request.responseType).toBe('text');
      expect(interceptor.handle).toHaveBeenCalledTimes(1);
    });
  });
});
