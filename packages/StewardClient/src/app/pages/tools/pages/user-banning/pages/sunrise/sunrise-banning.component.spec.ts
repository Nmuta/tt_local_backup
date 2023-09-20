import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SunrisePlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban-summaries';
import { fakeXuid } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { keys } from 'lodash';
import { defer, of } from 'rxjs';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';

import { SunriseBanningComponent } from './sunrise-banning.component';
import { toDateTime } from '@helpers/luxon';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { BanResultsUnion } from '../base/user-banning.base.component';
import { BackgroundJobService } from '@services/background-job/background-job.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunriseBanningComponent', () => {
  let component: SunriseBanningComponent;
  let fixture: ComponentFixture<SunriseBanningComponent>;
  let sunrise: SunriseService;

  let mockBackgroundJobService: BackgroundJobService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SunriseBanningComponent],
        providers: [createMockSunriseService(), createMockBackgroundJobService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    sunrise = TestBed.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanningComponent);
    component = fixture.componentInstance;
    mockBackgroundJobService = TestBed.inject(BackgroundJobService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitBan();
  });

  it('should gather summaries', () => {
    const testXuids = [fakeXuid(), fakeXuid(), fakeXuid()];
    sunrise.getBanSummariesByXuids$ = jasmine
      .createSpy('getBanSummariesByXuids')
      .and.callFake((xuids: BigNumber[]) => {
        const summaries = SunrisePlayersBanSummariesFakeApi.make(xuids);
        summaries.forEach(s => (s.banCount = new BigNumber(0)));
        summaries[0].banCount = new BigNumber(5);
        return defer(() => of(summaries));
      });

    const fakeIdentities = testXuids.map(
      xuid => <IdentityResultAlpha>{ gamertag: faker.name.firstName(), xuid: xuid },
    );
    component.playerIdentities = fakeIdentities;
    component.playerIdentities$.next(fakeIdentities);
    fixture.detectChanges();

    expect(sunrise.getBanSummariesByXuids$).toHaveBeenCalledTimes(1);
    expect(keys(component.summaryLookup).length).toBe(testXuids.length);

    const lookup0 = component.summaryLookup[testXuids[0].toString()];
    expect(lookup0).toBeDefined();
    expect(component.bannedXuids.length).toBe(1);
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
      isTestJob: false,
      reason: 'test',
    };

    beforeEach(() => {
      mockBackgroundJobService.getBackgroundJob$ = jasmine
        .createSpy('getBackgroundJob')
        .and.returnValue(of({}));
    });

    describe('When subscribing to the banning observable', () => {
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
          isTestJob: false,
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
