import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { AppState } from '@shared/state/app-state';
import _ from 'lodash';
import { Observable, of as ObservableOf, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { KustoGetQueriesFakeApi } from './apis/kusto/queries';
import { KustoRunQueryFakeApi } from './apis/kusto/run';

import { ApolloPlayerGamertagDetailsFakeApi } from './apis/title/apollo/player/gamertag/details';
import { ApolloPlayerProfileIdInventoryFakeApi } from './apis/title/apollo/player/profileId/inventory';
import { ApolloPlayerXuidInventoryFakeApi } from './apis/title/apollo/player/xuid/inventory';
import { ApolloPlayerXuidInventoryProfilesFakeApi } from './apis/title/apollo/player/xuid/inventoryProfiles';
import { ApolloPlayerXuidGiftHistoryFakeApi } from './apis/title/apollo/player/xuid/giftHistory';
import { ApolloPlayersBanFakeApi } from './apis/title/apollo/players/ban';
import { ApolloPlayersBanWithBackgroundProcessingFakeApi } from './apis/title/apollo/players/ban_backgroundProcessing';
import { ApolloGroupGamertagsInventoryFakeApi } from './apis/title/apollo/group/gamertags/inventory';
import { ApolloGroupGroupIdInventoryFakeApi } from './apis/title/apollo/group/groupId/inventory';
import { ApolloGroupXuidsInventoryFakeApi } from './apis/title/apollo/group/xuids/inventory';
import { ApolloGroupGroupIdGiftHistoryFakeApi } from './apis/title/apollo/group/groupId/giftHistory';
import { ApolloGroupsFakeApi } from './apis/title/apollo/groups';
import { ApolloPlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/apollo/player/xuid/sharedConsoleUsers';
import { ApolloPlayerXuidConsolesFakeApi } from './apis/title/apollo/player/xuid/consoleDetails';
import { ApolloPlayerXuidUserFlagsFakeApi } from './apis/title/apollo/player/xuid/userFlags';

import { GravityPlayerGamertagDetailsFakeApi } from './apis/title/gravity/player/gamertag/details';
import { GravityPlayerXuidInventoryFakeApi } from './apis/title/gravity/player/xuid/inventory';
import { GravityPlayerXuidProfileIdInventoryFakeApi } from './apis/title/gravity/player/xuid/profileId/inventory';
import { GravityPlayerT10IdInventoryFakeApi } from './apis/title/gravity/player/t10Id/inventory';
import { GravityPlayerT10IdProfileIdInventoryFakeApi } from './apis/title/gravity/player/t10Id/profileId/inventory';
import { GravityPlayerT10IdGiftHistoryFakeApi } from './apis/title/gravity/player/t10Id/giftHistory';

import { OpusPlayerGamertagDetailsFakeApi } from './apis/title/opus/player/gamertag/details';
import { OpusPlayerProfileIdInventoryFakeApi } from './apis/title/opus/player/profileId/inventory';
import { OpusPlayerXuidInventoryFakeApi } from './apis/title/opus/player/xuid/inventory';
import { OpusPlayerXuidInventoryProfilesFakeApi } from './apis/title/opus/player/xuid/inventoryProfiles';

import { SunriseConsoleIsBannedFakeApi } from './apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidCreditUpdatesFakeApi } from './apis/title/sunrise/player/xuid/creditUpdates';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';
import { SunrisePlayerXuidGiftHistoryFakeApi } from './apis/title/sunrise/player/xuid/giftHistory';
import { SunrisePlayersBanFakeApi } from './apis/title/sunrise/players/ban';
import { SunrisePlayersBanWithBackgroundProcessingFakeApi } from './apis/title/sunrise/players/ban_backgroundProcessing';
import { SunrisePlayerXuidInventoryFakeApi } from './apis/title/sunrise/player/xuid/inventory';
import { SunrisePlayerXuidInventoryProfilesFakeApi } from './apis/title/sunrise/player/xuid/inventoryProfiles';
import { SunrisePlayerProfileIdInventoryFakeApi } from './apis/title/sunrise/player/profileId/inventory';
import { SunriseGroupGamertagsInventoryFakeApi } from './apis/title/sunrise/group/gamertags/inventory';
import { SunriseGroupGroupIdInventoryFakeApi } from './apis/title/sunrise/group/groupId/inventory';
import { SunriseGroupXuidsInventoryFakeApi } from './apis/title/sunrise/group/xuids/inventory';
import { SunriseGroupGroupIdGiftHistoryFakeApi } from './apis/title/sunrise/group/groupId/giftHistory';
import { SunriseGroupsFakeApi } from './apis/title/sunrise/groups';
import { SunrisePlayerXuidNotificationsFakeApi } from './apis/title/sunrise/player/xuid/notifications';
import { SunrisePlayersBanSummariesFakeApi } from './apis/title/sunrise/players/ban-summaries';
import { ApolloPlayersBanSummariesFakeApi } from './apis/title/apollo/players/ban-summaries';
import { LoggerService, LogTopic } from '@services/logger';
import { ApolloPlayersIdentitiesFakeApi } from './apis/title/apollo/players/identities';
import { OpusPlayersIdentitiesFakeApi } from './apis/title/opus/players/identities';
import { SunrisePlayersIdentitiesFakeApi } from './apis/title/sunrise/players/identities';
import { GravityPlayersIdentitiesFakeApi } from './apis/title/gravity/players/identities';
import { GravityPlayerT10IdDetailsFakeApi } from './apis/title/gravity/player/t10Id/details';
import { GravityMasterInventoryFakeApi } from './apis/title/gravity/masterInventory';
import { GravityGiftingPlayerFakeApi } from './apis/title/gravity/gifting/players';
import { SunriseMasterInventoryFakeApi } from './apis/title/sunrise/masterInventory';
import { SunriseGiftingLspGroupFakeApi } from './apis/title/sunrise/gifting/groupId';
import { SunriseGiftingPlayersFakeApi } from './apis/title/sunrise/gifting/players';
import { ApolloMasterInventoryFakeApi } from './apis/title/apollo/masterInventory';
import { ApolloGiftingPlayersFakeApi } from './apis/title/apollo/gifting/players';
import { ApolloGiftingLspGroupFakeApi } from './apis/title/apollo/gifting/groupId';
import { JobsGetJobFakeApi } from './apis/title/jobs/jobId';
import { SunriseGiftingPlayersReturnsBackgroundJobFakeApi } from './apis/title/sunrise/gifting/players_returnsbackgroundjob';
import { ApolloGiftingPlayersReturnsBackgroundJobFakeApi } from './apis/title/apollo/gifting/players_returnsbackgroundjob';
import { ApolloPlayerXuidBanHistoryFakeApi } from './apis/title/apollo/player/xuid/banHistory';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  // Gravity
  GravityPlayerGamertagDetailsFakeApi,
  GravityPlayerXuidInventoryFakeApi,
  GravityPlayerXuidProfileIdInventoryFakeApi,
  GravityPlayerT10IdDetailsFakeApi,
  GravityPlayerT10IdInventoryFakeApi,
  GravityPlayerT10IdProfileIdInventoryFakeApi,
  GravityPlayerT10IdInventoryFakeApi,
  GravityPlayerXuidInventoryFakeApi,
  GravityPlayerT10IdGiftHistoryFakeApi,
  GravityPlayersIdentitiesFakeApi,
  GravityMasterInventoryFakeApi,
  GravityGiftingPlayerFakeApi,

  // Sunrise
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
  SunrisePlayerXuidCreditUpdatesFakeApi,
  SunrisePlayerXuidUserFlagsFakeApi,
  SunrisePlayerXuidProfileSummaryFakeApi,
  SunrisePlayerXuidBanHistoryFakeApi,
  SunrisePlayerXuidGiftHistoryFakeApi,
  SunriseConsoleIsBannedFakeApi,
  SunriseGroupsFakeApi,
  SunrisePlayerXuidInventoryFakeApi,
  SunrisePlayerXuidInventoryProfilesFakeApi,
  SunrisePlayerProfileIdInventoryFakeApi,
  SunrisePlayersBanWithBackgroundProcessingFakeApi,
  SunrisePlayersBanFakeApi,
  SunrisePlayersBanSummariesFakeApi,
  SunrisePlayersIdentitiesFakeApi,
  SunriseGroupGamertagsInventoryFakeApi,
  SunriseGroupGroupIdInventoryFakeApi,
  SunriseGroupXuidsInventoryFakeApi,
  SunriseGroupGroupIdGiftHistoryFakeApi,
  SunrisePlayerXuidNotificationsFakeApi,
  SunriseMasterInventoryFakeApi,
  SunriseGiftingLspGroupFakeApi,
  SunriseGiftingPlayersReturnsBackgroundJobFakeApi,
  SunriseGiftingPlayersFakeApi,

  // Apollo
  ApolloPlayerGamertagDetailsFakeApi,
  ApolloPlayerXuidConsoleSharedConsoleUsersFakeApi,
  ApolloPlayerXuidConsolesFakeApi,
  ApolloPlayerXuidUserFlagsFakeApi,
  ApolloPlayerProfileIdInventoryFakeApi,
  ApolloPlayerXuidInventoryFakeApi,
  ApolloPlayerXuidInventoryProfilesFakeApi,
  ApolloPlayerXuidInventoryFakeApi,
  ApolloPlayerXuidGiftHistoryFakeApi,
  ApolloPlayersBanWithBackgroundProcessingFakeApi,
  ApolloPlayersBanFakeApi,
  ApolloPlayersBanSummariesFakeApi,
  ApolloPlayerXuidBanHistoryFakeApi,
  ApolloPlayersIdentitiesFakeApi,
  ApolloGroupGamertagsInventoryFakeApi,
  ApolloGroupGroupIdInventoryFakeApi,
  ApolloGroupXuidsInventoryFakeApi,
  ApolloGroupGroupIdGiftHistoryFakeApi,
  ApolloGroupsFakeApi,
  ApolloMasterInventoryFakeApi,
  ApolloGiftingPlayersReturnsBackgroundJobFakeApi,
  ApolloGiftingPlayersFakeApi,
  ApolloGiftingLspGroupFakeApi,

  // Opus
  OpusPlayerGamertagDetailsFakeApi,
  OpusPlayerProfileIdInventoryFakeApi,
  OpusPlayerXuidInventoryFakeApi,
  OpusPlayerXuidInventoryProfilesFakeApi,
  OpusPlayersIdentitiesFakeApi,

  // Kusto
  KustoGetQueriesFakeApi,
  KustoRunQueryFakeApi,

  // Other
  JobsGetJobFakeApi,
];

/** The URLs this interceptor will not block. */
const urlAllowList = [
  `${environment.stewardApiUrl}/api/v1/me`,
  'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.js',
  'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js',
];

/** Intercepts every request and returns a sample response if it matches the conditions. */
@Injectable()
export class FakeApiInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store, private readonly logger: LoggerService) {}

  /** Interception hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const isEnabled = this.store.selectSnapshot<boolean>(
      (state: AppState) => state.userSettings.enableFakeApi,
    );
    if (!isEnabled) {
      return next.handle(request);
    }

    for (const fakeApiConstructor of fakeApiConstructors) {
      const fakeApi = new fakeApiConstructor(request);
      if (fakeApi.canHandle) {
        this.logger.log([LogTopic.FakeApi], `${request.url} -> ${fakeApi.constructor.name}`);
        return ObservableOf(
          new HttpResponse({
            body: fakeApi.handle(request.body),
          }),
        ).pipe(delay(_.random(1500) + 500));
      }
    }

    const isAllowed = urlAllowList.includes(request.url);
    if (!isAllowed) {
      return throwError(
        new HttpErrorResponse({
          url: request.url,
          status: 9000,
          statusText:
            'Request blocked because Fake API enabled. URL was not handled by Fake API, and was not on the allowed real-API list.',
        }),
      );
    }

    return next.handle(request);
  }
}
