import { getTestBed, TestBed } from '@angular/core/testing';
import { SunriseConsoleIsBannedFakeApi } from '@interceptors/fake-api/apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/userFlags';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { SunriseUserFlags } from '@models/sunrise';
import { ApiService, createMockApiService } from '@services/api';

import * as faker from 'faker';

import { OpusService } from './opus.service';

describe('OpusService', () => {
  let injector: TestBed;
  let service: OpusService;
  let apiServiceMock: ApiService;
  let nextReturnValue: object | [] = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [createMockApiService(() => nextReturnValue)],
    });
    injector = getTestBed();
    service = injector.inject(OpusService);
    apiServiceMock = injector.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handles getPlayerDetailsByGamertag', done => {
    const typedReturnValue = (nextReturnValue = OpusPlayerGamertagDetailsFakeApi.make());
    service
      .getPlayerDetailsByGamertag(typedReturnValue.gamertag)
      .subscribe(output => {
        expect(output).toEqual(
          nextReturnValue as any,
          'fields should not be modified'
        );
        done();
      });
  });
});
