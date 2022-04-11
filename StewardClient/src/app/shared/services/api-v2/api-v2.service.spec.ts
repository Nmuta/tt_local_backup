// General
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

// Services
import { ApiV2Service } from '@shared/services/api-v2/api-v2.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('service: ApiV2Service', () => {
  let injector: TestBed;
  let apiService: ApiV2Service;
  let httpMock: HttpTestingController;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [ApiV2Service],
      schemas: [NO_ERRORS_SCHEMA],
    });
    injector = getTestBed();
    apiService = injector.inject(ApiV2Service);
    httpMock = injector.inject(HttpTestingController);
    mockRouter = injector.inject(Router);

    mockRouter.navigate = jasmine.createSpy('navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Method: getRequest', () => {
    const url = 'test';
    const expectedApiUrl = `${environment.stewardApiUrl}/api/v2/${url}`;
    const params = new HttpParams().set('test-header', '1234');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.getRequest$(url, params, headers).subscribe(response => {
          expect(response).toBeTruthy();
          done();
        });
        const req = httpMock.expectOne(r => r.method === 'GET' && r.url === expectedApiUrl);
        expect(req.request.params).toEqual(params);
        expect(req.request.headers).toEqual(headers);
        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.getRequest$(url, params, headers).subscribe(
          () => {
            expect(false).toBeTruthy();
          },
          () => {
            expect(true).toBeTruthy();
          },
        );
        const req = httpMock.expectOne(r => r.method === 'GET' && r.url === expectedApiUrl);
        req.error(new ErrorEvent('error'));
      });
    });
  });
  describe('Method: postRequest', () => {
    let url;
    let apiUrl;
    let object;
    beforeEach(() => {
      url = 'test';
      apiUrl = `${environment.stewardApiUrl}/api/v2/${url}`;
      object = { foo: 'bar' };
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.postRequest$(url, object).subscribe(response => {
          expect(response).toBeTruthy();
          done();
        });

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url === apiUrl);
        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.postRequest$(url, object).subscribe(
          () => {
            expect(false).toBeTruthy();
          },
          () => {
            expect(true).toBeTruthy();
          },
        );

        const req = httpMock.expectOne(r => r.method === 'POST' && r.url === apiUrl);
        req.error(new ErrorEvent('error'));
      });
    });
  });

  describe('Method: putRequest', () => {
    let url;
    let apiUrl;
    let params;
    let object;
    beforeEach(() => {
      url = 'test';
      apiUrl = `${environment.stewardApiUrl}/api/v2/${url}`;
      object = {};
      params = new HttpParams().set('id', '1234');
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.putRequest$(url, object, params).subscribe(response => {
          expect(response).toBeTruthy();
          done();
        });

        const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === apiUrl);
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');

        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.putRequest$(url, object, params).subscribe(
          () => {
            expect(false).toBeTruthy();
          },
          () => {
            expect(true).toBeTruthy();
          },
        );
        const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === apiUrl);
        req.error(new ErrorEvent('error'));
      });
    });
  });

  describe('Method: deleteObject', () => {
    let url;
    let apiUrl;
    let params;
    beforeEach(() => {
      url = 'test';
      apiUrl = `${environment.stewardApiUrl}/api/v2/${url}`;
      params = new HttpParams().set('id', '1234');
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.deleteRequest$(url, params).subscribe(response => {
          expect(response).toBeTruthy();
          done();
        });
        const req = httpMock.expectOne(r => r.method === 'DELETE' && r.url === apiUrl);
        expect(req.request.headers.get('Content-Type')).toEqual('application/json');

        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.deleteRequest$(url, params).subscribe(
          () => {
            expect(false).toBeTruthy();
          },
          () => {
            expect(true).toBeTruthy();
          },
        );
        const req = httpMock.expectOne(r => r.method === 'DELETE' && r.url === apiUrl);
        req.error(new ErrorEvent('error'));
      });
    });
  });
});
