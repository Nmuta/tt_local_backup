import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { of, throwError } from 'rxjs';
import { BanResultsUnion, UserBanningBaseComponent } from './user-banning.base.component';
import faker from 'faker';

describe('UserBanningBaseComponent', () => {
  let component: UserBanningBaseComponent;
  let fixture: ComponentFixture<UserBanningBaseComponent>;

  let mockBackgroundJobService: BackgroundJobService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBanningBaseComponent],
      providers: [createMockBackgroundJobService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBanningBaseComponent);
    component = fixture.componentInstance;

    mockBackgroundJobService = TestBed.inject(BackgroundJobService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: waitForBackgroundJobToComplete', () => {
    const testJob: BackgroundJob<void> = {
      jobId: 'test=-job-id',
      status: BackgroundJobStatus.InProgress,
      result: undefined,
      parsedResult: undefined,
    };

    beforeEach(() => {
      mockBackgroundJobService.getBackgroundJob = jasmine
        .createSpy('getBackgroundJob')
        .and.returnValue(of({}));
    });

    it('should call BackgroundJobService.getBackgroundJob with correct job id', () => {
      component.waitForBackgroundJobToComplete(testJob);

      expect(mockBackgroundJobService.getBackgroundJob).toHaveBeenCalledWith(testJob.jobId);
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And an error is caught', () => {
        const error = { message: 'error-message' };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(throwError(error));
        });

        it('should set loadError on component', () => {
          component.waitForBackgroundJobToComplete(testJob);

          expect(component.loadError).toEqual(error);
          expect(component.isLoading).toBeFalsy();
        });
      });

      describe('And a BackgroundJob is returned', () => {
        const testBackgroundJobResp: BackgroundJob<BanResultsUnion[]> = {
          jobId: 'test=-job-id',
          status: BackgroundJobStatus.InProgress,
          result: 'result',
          parsedResult: [
            {
              xuid: BigInt(faker.random.number()),
              success: true,
              banDescription: undefined,
            },
          ],
        };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(of(testBackgroundJobResp));
        });

        describe('with a status of complete', () => {
          it('should set gift response', () => {
            testBackgroundJobResp.status = BackgroundJobStatus.Completed;
            component.waitForBackgroundJobToComplete(testJob);

            expect(component.banResults).toEqual(testBackgroundJobResp.parsedResult);
          });
        });
      });
    });
  });

  describe('Method: resetBanningToolUI', () => {
    beforeEach(() => {
      component.banResults = [];
      component.loadError = {};
      component.isLoading = true;
    });

    it('should reset UI', () => {
      component.resetBanningToolUI();

      expect(component.banResults).toBeUndefined();
      expect(component.loadError).toBeUndefined();
      expect(component.isLoading).toBeFalsy();
    });
  });
});
