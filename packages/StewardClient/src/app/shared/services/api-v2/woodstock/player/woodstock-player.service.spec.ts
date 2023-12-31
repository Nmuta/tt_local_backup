import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ReportWeightType } from '@models/report-weight';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';

import { WoodstockPlayerService } from './woodstock-player.service';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayerService', () => {
  let service: WoodstockPlayerService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [],
        providers: [createMockApiV2Service(() => nextReturnValue)],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    );
    const injector = getTestBed();
    service = injector.inject(WoodstockPlayerService);
    apiServiceMock = injector.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getUserReportWeight', () => {
    const xuid = fakeXuid();
    const fakeResponse = {
      weight: new BigNumber(faker.datatype.number({ min: 0, max: 100 })),
      type: ReportWeightType.Default,
    };

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine
        .createSpy('getRequest')
        .and.returnValue(of(fakeResponse));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.getUserReportWeight$(xuid).subscribe(response => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/reportWeight`,
        );
        expect(response).toEqual(fakeResponse);
        done();
      });
    });
  });

  describe('Method: setUserReportWeight', () => {
    const xuid = fakeXuid();
    const reportWeight = ReportWeightType.Default;

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest').and.returnValue(of(null));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.setUserReportWeight$(xuid, reportWeight).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/reportWeight`,
          reportWeight,
        );
        done();
      });
    });
  });
});
