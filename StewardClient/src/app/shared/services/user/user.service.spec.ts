// General
import { TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, of } from 'rxjs';

// Services
import { ApiService, createMockApiService } from '@shared/services/api';
import { UserService } from './user.service';

describe('service: UserService', () => {
  let service: UserService;
  let apiMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [UserService, createMockApiService()],
    });
    service = TestBed.get(UserService);
    apiMock = TestBed.get(ApiService);
  });

  describe('Method: getUserProfile', () => {
    let headers;
    beforeEach(() => {
      apiMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
      headers = new HttpHeaders().set('Content-Type', 'application/json');
    });
    it('should call API service getRequest with the expected params', done => {
      service.getUserProfile().subscribe(res => {
        expect(apiMock.getRequest).toHaveBeenCalledWith(`me`);
        done();
      });
    });
  });
});
