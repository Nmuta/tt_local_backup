import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLeaderboardService } from './woodstock-leaderboard.service';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import faker from '@faker-js/faker';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { of } from 'rxjs';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';

describe('WoodstockLeaderboardService', () => {
  let service: WoodstockLeaderboardService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [createMockApiV2Service(() => nextReturnValue)],
    });

    service = TestBed.inject(WoodstockLeaderboardService);
    apiServiceMock = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getLeaderboards', () => {
    const scoreboardTypeId = fakeBigNumber();
    const scoreTypeId = fakeBigNumber();
    const trackId = fakeBigNumber();
    const pivotId = fakeBigNumber();
    const startAt = fakeBigNumber();
    const maxResults = fakeBigNumber();
    const endpointKeyOverride = faker.random.word();

    const expectedParams = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('startAt', startAt.toString())
      .set('maxResults', maxResults.toString());

    const expectedHeaders = new HttpHeaders()
      .set('endpointKey', `Woodstock|${endpointKeyOverride}`)
      .set('endpoint-woodstock', endpointKeyOverride);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service
        .getLeaderboardScores$(
          scoreboardTypeId,
          scoreTypeId,
          trackId,
          pivotId,
          [],
          startAt,
          maxResults,
        )
        .subscribe(() => {
          expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
            `${service.basePath}/scores/top`,
            expectedParams,
            new HttpHeaders(),
          );
          done();
        });
    });

    it('should call API service getRequest$ with the expected params and headers', done => {
      service
        .getLeaderboardScores$(
          scoreboardTypeId,
          scoreTypeId,
          trackId,
          pivotId,
          [],
          startAt,
          maxResults,
          endpointKeyOverride,
        )
        .subscribe(() => {
          expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
            `${service.basePath}/scores/top`,
            expectedParams,
            expectedHeaders,
          );
          done();
        });
    });
  });

  describe('Method: getLeaderboardScoresNearPlayer', () => {
    const xuid = fakeBigNumber();
    const scoreboardTypeId = fakeBigNumber();
    const scoreTypeId = fakeBigNumber();
    const trackId = fakeBigNumber();
    const pivotId = fakeBigNumber();
    const maxResults = fakeBigNumber();
    const endpointKeyOverride = faker.random.word();

    const expectedParams = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('maxResults', maxResults.toString());

    const expectedHeaders = new HttpHeaders()
      .set('endpointKey', `Woodstock|${endpointKeyOverride}`)
      .set('endpoint-woodstock', endpointKeyOverride);

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service
        .getLeaderboardScoresNearPlayer$(
          xuid,
          scoreboardTypeId,
          scoreTypeId,
          trackId,
          pivotId,
          [],
          maxResults,
        )
        .subscribe(() => {
          expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
            `${service.basePath}/scores/near-player/${xuid}`,
            expectedParams,
            new HttpHeaders(),
          );
          done();
        });
    });

    it('should call API service getRequest$ with the expected params and headers', done => {
      service
        .getLeaderboardScoresNearPlayer$(
          xuid,
          scoreboardTypeId,
          scoreTypeId,
          trackId,
          pivotId,
          [],
          maxResults,
          endpointKeyOverride,
        )
        .subscribe(() => {
          expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(
            `${service.basePath}/scores/near-player/${xuid}`,
            expectedParams,
            expectedHeaders,
          );
          done();
        });
    });
  });

  describe('Method: deleteLeaderboardScores', () => {
    const scoreIds = [faker.datatype.uuid(), faker.datatype.uuid(), faker.datatype.uuid()];
    const endpointKeyOverride = faker.random.word();

    const expectedHeaders = new HttpHeaders()
      .set('endpointKey', `Woodstock|${endpointKeyOverride}`)
      .set('endpoint-woodstock', endpointKeyOverride);

    beforeEach(() => {
      apiServiceMock.postRequest$ = jasmine.createSpy('postRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.deleteLeaderboardScores$(scoreIds).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/scores/delete`,
          scoreIds,
          undefined,
          new HttpHeaders(),
        );
        done();
      });
    });

    it('should call API service getRequest$ with the expected params and headers', done => {
      service.deleteLeaderboardScores$(scoreIds, endpointKeyOverride).subscribe(() => {
        expect(apiServiceMock.postRequest$).toHaveBeenCalledWith(
          `${service.basePath}/scores/delete`,
          scoreIds,
          undefined,
          expectedHeaders,
        );
        done();
      });
    });
  });
});
