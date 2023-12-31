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
import { ApolloPlayersBanWithBackgroundProcessingFakeApi } from './apis/title/apollo/players/useBackgroundProcessing/ban';
import { ApolloGroupGroupIdGiftHistoryFakeApi } from './apis/title/apollo/group/groupId/giftHistory';
import { ApolloGroupsFakeApi } from './apis/title/apollo/groups';
import { ApolloPlayersBanSummariesFakeApi } from './apis/title/apollo/players/ban-summaries';
import { ApolloPlayersIdentitiesFakeApi } from './apis/title/apollo/players/identities';
import { ApolloMasterInventoryFakeApi } from './apis/title/apollo/masterInventory';
import { ApolloGiftingPlayersFakeApi } from './apis/title/apollo/gifting/players';
import { ApolloGiftingLspGroupFakeApi } from './apis/title/apollo/gifting/groupId';
import { ApolloGiftingPlayersReturnsBackgroundJobFakeApi } from './apis/title/apollo/gifting/useBackgroundProcessing/players';
import { ApolloPlayerXuidBanHistoryFakeApi } from './apis/title/apollo/player/xuid/banHistory';
import { ApolloPlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/apollo/player/xuid/sharedConsoleUsers';
import { ApolloPlayerXuidConsolesFakeApi } from './apis/title/apollo/player/xuid/consoleDetails';
import { ApolloPlayerXuidUserFlagsFakeApi } from './apis/title/apollo/player/xuid/userFlags';

import { OpusPlayerGamertagDetailsFakeApi } from './apis/title/opus/player/gamertag/details';
import { OpusPlayerProfileIdInventoryFakeApi } from './apis/title/opus/player/profileId/inventory';
import { OpusPlayerXuidInventoryFakeApi } from './apis/title/opus/player/xuid/inventory';
import { OpusPlayerXuidInventoryProfilesFakeApi } from './apis/title/opus/player/xuid/inventoryProfiles';
import { OpusPlayersIdentitiesFakeApi } from './apis/title/opus/players/identities';

import { SunriseConsoleIsBannedFakeApi } from './apis/title/sunrise/console/isBanned';
import { SunrisePlayerGamertagDetailsFakeApi } from './apis/title/sunrise/player/gamertag/details';
import { SunrisePlayerXuidBanHistoryFakeApi } from './apis/title/sunrise/player/xuid/banHistory';
import { SunrisePlayerXuidConsolesFakeApi } from './apis/title/sunrise/player/xuid/consoleDetails';
import { SunrisePlayerXuidProfileSummaryFakeApi } from './apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi } from './apis/title/sunrise/player/xuid/sharedConsoleUsers';
import { SunrisePlayerXuidUserFlagsFakeApi } from './apis/title/sunrise/player/xuid/userFlags';
import { SunrisePlayerXuidGiftHistoryFakeApi } from './apis/title/sunrise/player/xuid/giftHistory';
import { SunrisePlayersBanFakeApi } from './apis/title/sunrise/players/ban';
import { SunrisePlayersBanWithBackgroundProcessingFakeApi } from './apis/title/sunrise/players/ban_backgroundProcessing';
import { SunrisePlayerXuidInventoryFakeApi } from './apis/title/sunrise/player/xuid/inventory';
import { SunrisePlayerXuidInventoryProfilesFakeApi } from './apis/title/sunrise/player/xuid/inventoryProfiles';
import { SunrisePlayerProfileIdInventoryFakeApi } from './apis/title/sunrise/player/profileId/inventory';
import { SunriseGroupGroupIdGiftHistoryFakeApi } from './apis/title/sunrise/group/groupId/giftHistory';
import { SunriseGroupsFakeApi } from './apis/title/sunrise/groups';
import { SunrisePlayerXuidNotificationsFakeApi } from './apis/title/sunrise/player/xuid/notifications';
import { SunrisePlayersBanSummariesFakeApi } from './apis/title/sunrise/players/ban-summaries';
import { SunriseSendCommunityMessageFakeApi } from './apis/title/sunrise/notifications/send';
import { SunriseSendCommunityMessageToLspGroupFakeApi } from './apis/title/sunrise/notifications/send/groupId';
import { SunrisePlayersIdentitiesFakeApi } from './apis/title/sunrise/players/identities';
import { SunriseMasterInventoryFakeApi } from './apis/title/sunrise/masterInventory';
import { SunriseGiftingLspGroupFakeApi } from './apis/title/sunrise/gifting/groupId';
import { SunriseGiftingPlayersFakeApi } from './apis/title/sunrise/gifting/players';
import { SunriseGiftingPlayersReturnsBackgroundJobFakeApi } from './apis/title/sunrise/gifting/useBackgroundProcessing/players';
import { SunrisePlayerXuidAuctionsFakeApi } from './apis/title/sunrise/player/xuid/auctions';
import { SunriseSimpleCarsFakeApi } from './apis/title/sunrise/kusto/cars';
import { SunrisePlayerXuidProfileNotesApi } from './apis/title/sunrise/player/xuid/profileNotes';
import { SunrisePlayerXuidBackstagePassHistoryFakeApi } from './apis/title/sunrise/player/xuid/backstagePassHistory';
import { SunrisePlayerXuidAccountInventoryFakeApi } from './apis/title/sunrise/player/xuid/accountInventory';
import { SunriseGiftLiveryToLspGroupFakeApi } from './apis/title/sunrise/gifting/livery/groupId';
import { SunriseGiftLiveryToPlayersFakeApi } from './apis/title/sunrise/gifting/livery/useBackgroundProcessing/players';

import { WoodstockPlayerXuidBackstagePassHistoryFakeApi } from './apis/title/woodstock/player/xuid/backstagePassHistory';
import { WoodstockPlayerXuidAccountInventoryFakeApi } from './apis/title/woodstock/player/xuid/accountInventory';
import { WoodstockGiftLiveryToLspGroupFakeApi } from './apis/title/woodstock/gifting/livery/groupId';
import { WoodstockGiftLiveryToPlayersFakeApi } from './apis/title/woodstock/gifting/livery/useBackgroundProcessing/players';
import { WoodstockPlayerXuidProfileNotesApi } from './apis/title/woodstock/player/xuid/profileNotes';
import { WoodstockLeaderboardsFakeApi } from './apis/title/woodstock/leaderboards';
import { WoodstockLeaderboardScoresTopTopFakeApi } from './apis/title/woodstock/leaderboard/scores/top';
import { WoodstockLeaderboardScoresDeleteFakeApi } from './apis/title/woodstock/leaderboard/scores/delete';
import { WoodstockLeaderboardScoresNearPlayerXuidTopFakeApi } from './apis/title/woodstock/leaderboard/scores/near-player/xuid';

import { SteelheadPlayerInventoryProfilesFakeApi } from './apis/v2/steelhead/player/xuid/profiles';
import { SteelheadPlayerInventoryFakeApi } from './apis/v2/steelhead/player/xuid/inventory';

import { LoggerService, LogTopic } from '@services/logger';
import { JobsGetJobFakeApi } from './apis/title/jobs/jobId';
import { PipelineGetFakeApi } from './apis/pipeline/get';
import { PipelinePutFakeApi } from './apis/pipeline/put';
import { PipelinePostFakeApi } from './apis/pipeline/post';
import { PipelineDeleteFakeApi } from './apis/pipeline/delete';
import { SettingsGetEndpointsFakeApi } from './apis/title/settings/lspEndpoints';

/** The list of Fake APIs to query, in order. */
const fakeApiConstructors = [
  // Steelhead
  SteelheadPlayerInventoryProfilesFakeApi,
  SteelheadPlayerInventoryFakeApi,

  // Woodstock
  WoodstockPlayerXuidBackstagePassHistoryFakeApi,
  WoodstockPlayerXuidAccountInventoryFakeApi,
  WoodstockGiftLiveryToLspGroupFakeApi,
  WoodstockGiftLiveryToPlayersFakeApi,
  WoodstockPlayerXuidProfileNotesApi,
  WoodstockLeaderboardsFakeApi,
  WoodstockLeaderboardScoresTopTopFakeApi,
  WoodstockLeaderboardScoresDeleteFakeApi,
  WoodstockLeaderboardScoresNearPlayerXuidTopFakeApi,

  // Sunrise
  SunrisePlayerGamertagDetailsFakeApi,
  SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi,
  SunrisePlayerXuidConsolesFakeApi,
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
  SunriseGroupGroupIdGiftHistoryFakeApi,
  SunrisePlayerXuidNotificationsFakeApi,
  SunriseMasterInventoryFakeApi,
  SunriseGiftingLspGroupFakeApi,
  SunriseGiftingPlayersReturnsBackgroundJobFakeApi,
  SunriseGiftingPlayersFakeApi,
  SunriseSendCommunityMessageFakeApi,
  SunriseSendCommunityMessageToLspGroupFakeApi,
  SunriseSendCommunityMessageFakeApi,
  SunriseSendCommunityMessageToLspGroupFakeApi,
  SunrisePlayerXuidAuctionsFakeApi,
  SunriseSimpleCarsFakeApi,
  SunrisePlayerXuidProfileNotesApi,
  SunrisePlayerXuidBackstagePassHistoryFakeApi,
  SunrisePlayerXuidAccountInventoryFakeApi,
  SunriseGiftLiveryToLspGroupFakeApi,
  SunriseGiftLiveryToPlayersFakeApi,

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

  // Pipelines
  PipelineGetFakeApi,
  PipelinePutFakeApi,
  PipelinePostFakeApi,
  PipelineDeleteFakeApi,

  //Settings
  SettingsGetEndpointsFakeApi,
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
