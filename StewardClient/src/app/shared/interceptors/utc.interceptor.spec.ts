import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { clone } from 'lodash';

import { UtcInterceptor } from './utc.interceptor';

type TestResponseSimple = {
  test: unknown;
  testUtc: Date | string;
};
type TestResponseArray = TestResponseSimple[];
type TestResponseComposite = {
  test: unknown;
  testUtc: Date | string;
  nested: TestResponseSimple;
  array: TestResponseArray;
};
type TestResponseCompositeArray = TestResponseComposite[];
type TestResponse = {
  test: unknown;
  testUtc: Date | string;
  nested: TestResponseSimple;
  array: TestResponseArray;
  deeplyNested: TestResponseComposite;
  deeplyNestedArray: TestResponseCompositeArray;
  selfReferentail?: TestResponse;
};

// strategy based on https://dev.to/alisaduncan/intercepting-http-requests---using-and-testing-angulars-httpclient
describe('UtcInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let interceptor: UtcInterceptor;
  const testUrl = `${environment.stewardApiUrl}/test`;
  const testResponseSimple: TestResponseSimple = {
    test: 'test1',
    testUtc: `${new Date()}`,
  };
  const testResponseArray: TestResponseArray = [
    testResponseSimple,
    testResponseSimple,
    testResponseSimple,
  ];
  const testResponseComposite: TestResponseComposite = {
    test: 'test2',
    testUtc: `${new Date()}`,
    nested: testResponseSimple,
    array: testResponseArray,
  };
  const testResponseCompositeArray: TestResponseCompositeArray = [
    testResponseComposite,
    testResponseComposite,
    testResponseComposite,
  ];
  const testResponse: TestResponse = {
    test: 'test3',
    testUtc: `${new Date()}`,
    nested: testResponseSimple,
    deeplyNested: testResponseComposite,
    array: testResponseArray,
    deeplyNestedArray: testResponseCompositeArray,
  };

  beforeEach(() => {
    interceptor = new UtcInterceptor();
    interceptor.handle = jasmine.createSpy('handle', interceptor.handle).and.callThrough();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: interceptor,
          multi: true,
        },
      ],
    });

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

  it('skips non-steward urls', () => {
    const badUrl = 'http://💩/test';
    http.get(badUrl, { responseType: 'json' }).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(badUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

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
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponse);
  });

  it('properly converts top level object', done => {
    http
      .get<TestResponse>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        expect(response.testUtc instanceof Date).toBeTruthy();
        expect(response.test instanceof Date).toBeFalsy();
        expect(response.test).toBe(testResponse.test);

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponse);
  });

  it('properly converts nested objects', done => {
    http
      .get<TestResponse>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        expect(response.nested.testUtc instanceof Date).toBeTruthy();
        expect(response.nested.test instanceof Date).toBeFalsy();
        expect(response.nested.test).toBe(testResponse.nested.test);

        expect(response.deeplyNested.testUtc instanceof Date).toBeTruthy();
        expect(response.deeplyNested.test instanceof Date).toBeFalsy();
        expect(response.deeplyNested.test).toBe(testResponse.deeplyNested.test);

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponse);
  });

  it('properly converts deeply nested objects', done => {
    http
      .get<TestResponse>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        expect(response.deeplyNested.nested.testUtc instanceof Date).toBeTruthy();
        expect(response.deeplyNested.nested.test instanceof Date).toBeFalsy();
        expect(response.test).toBe(testResponse.test);

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');
    const thisTestResponse = clone(testResponse);
    thisTestResponse.array = undefined;
    thisTestResponse.deeplyNestedArray = undefined;
    req.flush(testResponse);
  });

  it('properly converts top-level arrays', done => {
    http
      .get<TestResponseArray>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        for (const item of response) {
          expect(item.testUtc instanceof Date).toBeTruthy();
          expect(item.test instanceof Date).toBeFalsy();
          expect(item.test).toBe(testResponseSimple.test);
        }

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponseArray);
  });

  it('properly converts nested top-level nested arrays', done => {
    http
      .get<TestResponseCompositeArray>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        for (const item of response) {
          expect(item.testUtc instanceof Date).toBeTruthy();
          expect(item.test instanceof Date).toBeFalsy();
          expect(item.test).toBe(testResponseComposite.test);
          for (const item2 of item.array) {
            expect(item2.testUtc instanceof Date).toBeTruthy();
            expect(item2.test instanceof Date).toBeFalsy();
            expect(item2.test).toBe(testResponseSimple.test);
          }
        }

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponseCompositeArray);
  });

  it('properly converts deeply nested arrays', done => {
    http
      .get<TestResponse>(testUrl, { responseType: 'json' })
      .subscribe(response => {
        expect(response).toBeTruthy();
        expect(interceptor.handle).toHaveBeenCalledTimes(1);

        for (const item of response.deeplyNestedArray) {
          expect(item.testUtc instanceof Date).toBeTruthy();
          expect(item.test instanceof Date).toBeFalsy();
          expect(item.test).toBe(testResponseComposite.test);
          for (const item2 of item.array) {
            expect(item2.testUtc instanceof Date).toBeTruthy();
            expect(item2.test instanceof Date).toBeFalsy();
            expect(item2.test).toBe(testResponseSimple.test);
          }
        }

        for (const item2 of response.array) {
          expect(item2.testUtc instanceof Date).toBeTruthy();
          expect(item2.test instanceof Date).toBeFalsy();
          expect(item2.test).toBe(testResponseSimple.test);
        }

        done();
      });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('json');

    req.flush(testResponse);
  });
});
