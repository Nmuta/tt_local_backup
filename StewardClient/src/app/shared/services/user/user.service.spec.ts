// General
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

// Services
import { ApiService, createMockApiService } from '@shared/services/api';
import { UserService } from './user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('service: UserService', () => {
  let service: UserService;
  let apiMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [UserService, createMockApiService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.get(UserService);
    apiMock = TestBed.get(ApiService);
  });

  describe('Method: getUserProfile$', () => {
    beforeEach(() => {
      apiMock.getRequest$ = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getUserProfile$().subscribe(() => {
        expect(apiMock.getRequest$).toHaveBeenCalledWith(`v1/me`);
        done();
      });
    });
  });
});
