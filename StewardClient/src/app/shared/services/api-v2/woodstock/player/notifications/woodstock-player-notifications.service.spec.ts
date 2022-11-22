import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { createMockApiV2Service } from '@services/api-v2/api-v2.service.mock';
import { of } from 'rxjs';

import { WoodstockPlayerNotificationsService } from './woodstock-player-notifications.service';

describe('WoodstockPlayerNotificationsService', () => {
  let service: WoodstockPlayerNotificationsService;
  let apiServiceMock: ApiV2Service;
  const nextReturnValue: unknown = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiV2Service(() => nextReturnValue)],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const injector = getTestBed();
    service = injector.inject(WoodstockPlayerNotificationsService);
    apiServiceMock = injector.inject(ApiV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Method: deleteAllPlayerNotifications', () => {
    const xuid = fakeXuid();

    beforeEach(() => {
      apiServiceMock.deleteRequest$ = jasmine.createSpy('deleteRequest').and.returnValue(of(null));
    });

    it('should call service.getRequest$ with correct params', done => {
      service.deleteAllPlayerNotifications$(xuid).subscribe(() => {
        expect(apiServiceMock.deleteRequest$).toHaveBeenCalledWith(
          `${service.basePath}/${xuid}/notifications`,
        );
        done();
      });
    });
  });
});
