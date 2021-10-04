import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import {
  ApolloBanHistoryEntry,
  ApolloBanRequest,
  ApolloBanResult,
  ApolloBanSummary,
  ApolloConsoleDetailsEntry,
  ApolloGift,
  ApolloGiftHistory,
  ApolloGroupGift,
  ApolloMasterInventory,
  ApolloPlayerDetails,
  ApolloPlayerInventory,
  ApolloPlayerInventoryProfile,
  ApolloSharedConsoleUser,
} from '@models/apollo';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { ApolloUserFlags } from '@models/apollo';
import { ApiService } from '@services/api';
import { chain } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { overrideApolloEndpointKey } from '@helpers/override-endpoint-key';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v1/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getPlayerIdentity$(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    const queryBatch: IdentityQueryAlphaBatch = [identityQuery];
    return this.getPlayerIdentities$(queryBatch).pipe(
      switchMap((data: IdentityResultAlphaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities$(
    identityQueries: IdentityQueryAlphaBatch,
    endpointKeyOverride?: string,
  ): Observable<IdentityResultAlphaBatch> {
    return this.apiService.postRequest$<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
      undefined,
      overrideApolloEndpointKey(endpointKeyOverride),
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids$(
    xuids: BigNumber[],
    endpointKeyOverride?: string,
  ): Observable<ApolloBanSummary[]> {
    return this.apiService.postRequest$<ApolloBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
      undefined,
      overrideApolloEndpointKey(endpointKeyOverride),
    );
  }

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<ApolloBanHistoryEntry[]> {
    return this.apiService.getRequest$<ApolloBanHistoryEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<ApolloUserFlags> {
    return this.apiService.getRequest$<ApolloUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid$(xuid: BigNumber, flags: ApolloUserFlags): Observable<ApolloUserFlags> {
    return this.apiService.putRequest$<ApolloUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<ApolloSharedConsoleUser[]> {
    return this.apiService.getRequest$<ApolloSharedConsoleUser[]>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }

  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<ApolloConsoleDetailsEntry[]> {
    return this.apiService.getRequest$<ApolloConsoleDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: ApolloBanRequest[]): Observable<ApolloBanResult[]> {
    return this.apiService.postRequest$<ApolloBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: ApolloBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets apollo player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag$(gamertag: string): Observable<ApolloPlayerDetails> {
    return this.apiService.getRequest$<ApolloPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid$(xuid: BigNumber): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest$<ApolloGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP Group. */
  public getGiftHistoryByLspGroup$(lspGroupId: BigNumber): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest$<ApolloGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets the apollo lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.apiService.getRequest$<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the apollo master inventory. */
  public getMasterInventory$(): Observable<ApolloMasterInventory> {
    return this.apiService.getRequest$<ApolloMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets the apollo player's inventory. */
  public getPlayerInventoryByXuid$(xuid: BigNumber): Observable<ApolloPlayerInventory> {
    return this.apiService.getRequest$<ApolloPlayerInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of an apollo player's inventory */
  public getPlayerInventoryByProfileId$(profileId: BigNumber): Observable<ApolloPlayerInventory> {
    return this.apiService.getRequest$<ApolloPlayerInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid$(
    xuid: BigNumber,
  ): Observable<ApolloPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest$<ApolloPlayerInventoryProfile[]>(
        `${this.basePath}/player/xuid(${xuid})/inventoryProfiles`,
      )
      .pipe(
        map(v =>
          chain(v)
            .sortBy(v => v.profileId)
            .reverse()
            .value(),
        ),
      );
  }

  /** Gift players inventory items. */
  public postGiftPlayers$(gift: ApolloGroupGift): Observable<GiftResponse<BigNumber>[]> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: ApolloGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup$(
    lspGroup: LspGroup,
    gift: ApolloGift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
