import { HttpParams } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ForzaSandbox } from '@models/enums';
import { ResetProfileOptions } from '@models/reset-profile-options';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { of } from 'rxjs';
import { SteelheadPlayerProfileService } from './steelhead-player-profile.service';

describe('SteelheadPlayerProfileService', () => {
  let service: SteelheadPlayerProfileService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const injector = getTestBed();
    service = injector.inject(SteelheadPlayerProfileService);
    apiServiceMock = injector.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: savePlayerProfileTemplate', () => {
    const xuid = fakeXuid();
    const profileId = faker.datatype.uuid();
    const templateNames = faker.datatype.string(10);
    const overwriteIfExists = faker.datatype.boolean();

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of(null));
    });

    it('should call service.postRequest$ with correct params', done => {
      service
        .savePlayerProfileTemplate$(xuid, profileId, templateNames, overwriteIfExists)
        .subscribe(() => {
          const params = new HttpParams().set('overwriteIfExists', overwriteIfExists.toString());

          expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
            `${service.basePath}/${xuid}/profile/${profileId}/save`,
            templateNames,
            params,
          );
          done();
        });
    });
  });

  describe('Method: loadTemplatetoPlayerProfile', () => {
    const xuid = fakeXuid();
    const profileId = faker.datatype.uuid();
    const templateNames = faker.datatype.string(10);
    const continueOnBreakingChanges = faker.datatype.boolean();
    const forzaSandbox = ForzaSandbox.Test;

    const fakeResponse = faker.datatype.uuid();

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine
        .createSpy('postRequest')
        .and.returnValue(of(fakeResponse));
    });

    it('should call service.postRequest$ with correct params', done => {
      service
        .loadTemplateToPlayerProfile$(
          xuid,
          profileId,
          templateNames,
          continueOnBreakingChanges,
          forzaSandbox,
        )
        .subscribe(response => {
          const params = new HttpParams()
            .append('continueOnBreakingChanges', continueOnBreakingChanges.toString())
            .append('forzaSandbox', ForzaSandbox.Test);

          expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
            `${service.basePath}/${xuid}/profile/${profileId}/load`,
            templateNames,
            params,
          );

          expect(response).toEqual(fakeResponse);
          done();
        });
    });
  });

  describe('Method: resetPlayerProfile', () => {
    const xuid = fakeXuid();
    const profileId = faker.datatype.uuid();
    const options = {
      resetCarProgressData: faker.datatype.boolean(),
      resetLeaderboardsData: faker.datatype.boolean(),
      resetRaceRankingData: faker.datatype.boolean(),
      resetStatsData: faker.datatype.boolean(),
      resetTrueSkillData: faker.datatype.boolean(),
      resetUserInventoryData: faker.datatype.boolean(),
      resetUserSafetyRatingData: faker.datatype.boolean(),
      resetUgcProfileData: faker.datatype.boolean(),
    } as ResetProfileOptions;

    const fakeResponse = faker.datatype.uuid();

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine
        .createSpy('postRequest')
        .and.returnValue(of(fakeResponse));
    });

    it('should call service.postRequest$ with correct params', done => {
      service.resetPlayerProfile$(xuid, profileId, options).subscribe(response => {
        const params = new HttpParams({ fromObject: { ...options } });

        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/profile/${profileId}/reset`,
          null,
          params,
        );

        expect(response).toEqual(fakeResponse);
        done();
      });
    });
  });
});
