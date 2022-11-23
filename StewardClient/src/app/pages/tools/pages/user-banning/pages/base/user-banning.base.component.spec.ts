import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { of } from 'rxjs';
import { BanResultsUnion, UserBanningBaseComponent } from './user-banning.base.component';
import faker from '@faker-js/faker';
import { createMockNotificationsService } from '@shared/hubs/notifications.service.mock';
import { toDateTime } from '@helpers/luxon';

describe('UserBanningBaseComponent', () => {
  let component: UserBanningBaseComponent;
  let fixture: ComponentFixture<UserBanningBaseComponent>;

  let mockBackgroundJobService: BackgroundJobService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBanningBaseComponent],
      providers: [createMockBackgroundJobService(), createMockNotificationsService()],
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

  describe('Method: waitForBackgroundJobToComplete$', () => {
    const testJob: BackgroundJob<void> = {
      createdDateUtc: toDateTime(faker.date.past()),
      userId: faker.datatype.uuid(),
      jobId: 'test=-job-id',
      status: BackgroundJobStatus.InProgress,
      result: undefined,
      rawResult: undefined,
      isMarkingRead: false,
      isRead: false,
      reason: 'test',
    };

    beforeEach(() => {
      mockBackgroundJobService.getBackgroundJob$ = jasmine
        .createSpy('getBackgroundJob')
        .and.returnValue(of({}));
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And a BackgroundJob is returned', () => {
        const testBackgroundJobResp: BackgroundJob<BanResultsUnion[]> = {
          createdDateUtc: toDateTime(faker.date.past()),
          userId: faker.datatype.uuid(),
          jobId: 'test=-job-id',
          status: BackgroundJobStatus.InProgress,
          result: [
            {
              xuid: new BigNumber(faker.datatype.number()),
              error: null,
              banDescription: undefined,
            },
          ],
          rawResult: {
            xuid: new BigNumber(faker.datatype.number()),
            success: true,
            banDescription: undefined,
          },
          isMarkingRead: false,
          isRead: false,
          reason: 'test',
        };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob$ = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(of(testBackgroundJobResp));
        });

        describe('with a status of complete', () => {
          it('should set gift response', done => {
            testBackgroundJobResp.status = BackgroundJobStatus.Completed;
            component.waitForBackgroundJobToComplete$(testJob).subscribe(() => {
              expect(component.banResults).toEqual(testBackgroundJobResp.result);
              done();
            });
          });
        });
      });
    });
  });

  describe('Method: resetBanningToolUI', () => {
    beforeEach(() => {
      component.banResults = [];
    });

    it('should reset UI', () => {
      component.resetBanningToolUI();

      expect(component.banResults).toBeUndefined();
      expect(component.banActionMonitor.isActive).toBeFalsy();
    });
  });
});
