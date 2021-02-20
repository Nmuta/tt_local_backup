// General
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

// Services
import { ApiService, createMockApiService } from '@shared/services/api';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BackgroundJobService } from './background-job.service';

describe('service: BackgroundJobService', () => {
  let service: BackgroundJobService;
  let apiMock: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [BackgroundJobService, createMockApiService()],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.get(BackgroundJobService);
    apiMock = TestBed.get(ApiService);
  });

  describe('Method: getUserProfile', () => {
    const jobId = 'test-job-id';

    beforeEach(() => {
      apiMock.getRequest = jasmine.createSpy('getRequest').and.returnValue(of({}));
    });

    it('should call API service getRequest with the expected params', done => {
      service.getBackgroundJob(jobId).subscribe(() => {
        expect(apiMock.getRequest).toHaveBeenCalledWith(`v1/jobs/jobId(${jobId})`);
        done();
      });
    });
  });
});
