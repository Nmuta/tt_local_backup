// General
import { TestBed, getTestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

// Services
import { ApiService } from '@shared/services/api/api.service';

describe('service: ApiService', () => {
  let injector: TestBed;
  let apiService: ApiService;
  let httpMock: HttpTestingController;
  let mockRouter: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [ApiService],
    });
    injector = getTestBed();
    apiService = injector.get(ApiService);
    httpMock = injector.get(HttpTestingController);
    mockRouter = injector.get(Router);

    mockRouter.navigate = jasmine.createSpy('navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Method: getRequest', () => {
    const url = 'test';
    const expectedApiUrl = `${environment.stewardApiUrl}/api/${url}`;
    const params = new HttpParams().set('test-header', '1234');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService
          .getRequest(url, params, headers)
          .subscribe((response: any) => {
            expect(response).toBeTruthy();
            done();
          });
        const req = httpMock.expectOne(
          r => r.method === 'GET' && r.url === expectedApiUrl
        );
        expect(req.request.params).toEqual(params);
        expect(req.request.headers).toEqual(headers);
        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.getRequest(url, params, headers).subscribe(
          (response: any) => {
            expect(false).toBeTruthy();
          },
          error => {
            expect(true).toBeTruthy();
          }
        );
        const req = httpMock.expectOne(
          r => r.method === 'GET' && r.url === expectedApiUrl
        );
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
      apiUrl = `${environment.stewardApiUrl}/api/${url}`;
      object = { foo: 'bar' };
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.postRequest(url, object).subscribe((response: any) => {
          expect(response).toBeTruthy();
          done();
        });

        const req = httpMock.expectOne(
          r => r.method === 'POST' && r.url === apiUrl
        );
        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.postRequest(url, object).subscribe(
          (response: any) => {
            expect(false).toBeTruthy();
          },
          error => {
            expect(true).toBeTruthy();
          }
        );

        const req = httpMock.expectOne(
          r => r.method === 'POST' && r.url === apiUrl
        );
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
      apiUrl = `${environment.stewardApiUrl}/api/${url}`;
      object = {};
      params = new HttpParams().set('id', '1234');
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService
          .putRequest(url, object, params)
          .subscribe((response: any) => {
            expect(response).toBeTruthy();
            done();
          });

        const req = httpMock.expectOne(
          r => r.method === 'PUT' && r.url === apiUrl
        );
        expect(req.request.headers.get('Content-Type')).toEqual(
          'application/json'
        );

        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.putRequest(url, object, params).subscribe(
          (response: any) => {
            expect(false).toBeTruthy();
          },
          error => {
            expect(true).toBeTruthy();
          }
        );
        const req = httpMock.expectOne(
          r => r.method === 'PUT' && r.url === apiUrl
        );
        req.error(new ErrorEvent('error'));
      });
    });
  });

  describe('Method: deleteObject', () => {
    let url;
    let apiUrl;
    let params;
    let object;
    beforeEach(() => {
      url = 'test';
      apiUrl = `${environment.stewardApiUrl}/api/${url}`;
      object = new Comment();
      params = new HttpParams().set('id', '1234');
    });
    describe('When the http request succeeds', () => {
      it('should make a get request to the expected url & set headers & params', done => {
        apiService.deleteRequest(url, params).subscribe((response: any) => {
          expect(response).toBeTruthy();
          done();
        });
        const req = httpMock.expectOne(
          r => r.method === 'DELETE' && r.url === apiUrl
        );
        expect(req.request.headers.get('Content-Type')).toEqual(
          'application/json'
        );

        req.flush({});
      });
    });
    describe('When the http request errors out', () => {
      it('should throw error', () => {
        apiService.deleteRequest(url, params).subscribe(
          (response: any) => {
            expect(false).toBeTruthy();
          },
          error => {
            expect(true).toBeTruthy();
          }
        );
        const req = httpMock.expectOne(
          r => r.method === 'DELETE' && r.url === apiUrl
        );
        req.error(new ErrorEvent('error'));
      });
    });
  });
});
