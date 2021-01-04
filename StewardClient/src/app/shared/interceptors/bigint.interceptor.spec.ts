import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BigintInterceptor } from './bigint.interceptor';

// strategy based on https://dev.to/alisaduncan/intercepting-http-requests---using-and-testing-angulars-httpclient
describe('BigintInterceptor:', () => {
  let interceptor: BigintInterceptor;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  const testUrl = 'http://localhost/test';
  const testResponse =
    '{ "bigInt": 1859489456156489156456498156189189489156178917561756715647534176, "nested": { "bigInt": 1859489456156489156456498156189189489156178917561756715647534176 }, "smallInt": 2, "string": "hello" }';

  beforeEach(() => {
    interceptor = new BigintInterceptor();
    interceptor.handle = jasmine.createSpy('handle', interceptor.handle).and.callThrough();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: interceptor,
          multi: true,
        },
      ],
    });

    // interceptor = TestBed.inject(BigintInterceptor);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('skips non-json', () => {
    http.get(testUrl, { responseType: 'text' }).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('text');

    req.flush(testResponse);

    expect(interceptor.handle).toHaveBeenCalledTimes(0);
  });

  it('handles json', done => {
    http.get(testUrl, { responseType: 'json' }).subscribe(response => {
      expect(response).toBeTruthy();
      expect(interceptor.handle).toHaveBeenCalledTimes(1);
      done();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('text');

    req.flush(testResponse);
  });

  it('converts large numbers', done => {
    http.get(testUrl, { responseType: 'json' }).subscribe(response => {
      expect(typeof response['bigInt'] === 'bigint').toBeTruthy();
      expect(typeof response['nested']['bigInt'] === 'bigint').toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('text');
    req.flush(testResponse);
  });

  it('converts small numbers', done => {
    http.get(testUrl, { responseType: 'json' }).subscribe(response => {
      expect(typeof response['smallInt'] === 'bigint').toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('text');
    req.flush(testResponse);
  });

  it('ignores strings', done => {
    http.get(testUrl, { responseType: 'json' }).subscribe(response => {
      expect(typeof response['string'] === 'string').toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('text');
    req.flush(testResponse);
  });
});
