import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WoodstockLeaderboardsService } from './woodstock-leaderboards.service';
import { HttpParams } from '@angular/common/http';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { of } from 'rxjs';

describe('WoodstockLeaderboardsService', () => {
  let service: WoodstockLeaderboardsService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [createMockApiV2Service(() => nextReturnValue)],
    });

    service = TestBed.inject(WoodstockLeaderboardsService);
    apiServiceMock = TestBed.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: getLeaderboards', () => {
    const expectedParams = new HttpParams().set('pegasusEnvironment', 'dev');

    beforeEach(() => {
      apiServiceMock.getRequest$ = jasmine.createSpy('getRequest$').and.returnValue(of([]));
    });

    it('should call API service getRequest$ with the expected params', done => {
      service.getLeaderboards$('dev').subscribe(() => {
        expect(apiServiceMock.getRequest$).toHaveBeenCalledWith(service.basePath, expectedParams);
        done();
      });
    });
  });
});
