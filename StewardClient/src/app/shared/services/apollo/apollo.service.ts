import { Injectable } from '@angular/core';
import {
  ApolloBanHistoryEntry,
  ApolloBanRequest,
  ApolloBanResult,
  ApolloBanSummary,
  ApolloGift,
  ApolloGiftHistory,
  ApolloGroupGift,
  ApolloMasterInventory,
  ApolloPlayerDetails,
  ApolloPlayerInventoryProfile,
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
import { ApiService } from '@services/api';
import { chain } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v1/title/apollo';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getPlayerIdentity(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    const queryBatch: IdentityQueryAlphaBatch = [identityQuery];
    return this.getPlayerIdentities(queryBatch).pipe(
      switchMap((data: IdentityResultAlphaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    return this.apiService.postRequest<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids(xuids: bigint[]): Observable<ApolloBanSummary[]> {
    return this.apiService.postRequest<ApolloBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid(xuid: bigint): Observable<ApolloBanHistoryEntry[]> {
    return this.apiService.getRequest<ApolloBanHistoryEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers(bans: ApolloBanRequest[]): Observable<ApolloBanResult[]> {
    return this.apiService.postRequest<ApolloBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing(
    bans: ApolloBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets apollo player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<ApolloPlayerDetails> {
    return this.apiService.getRequest<ApolloPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid(xuid: bigint): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest<ApolloGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP Group. */
  public getGiftHistoryByLspGroup(lspGroupId: bigint): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest<ApolloGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets the apollo lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the apollo master inventory. */
  public getMasterInventory(): Observable<ApolloMasterInventory> {
    return this.apiService.getRequest<ApolloMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets the apollo player's inventory. */
  public getPlayerInventoryByXuid(xuid: bigint): Observable<ApolloMasterInventory> {
    return this.apiService.getRequest<ApolloMasterInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of an apollo player's inventory */
  public getPlayerInventoryByProfileId(profileId: bigint): Observable<ApolloMasterInventory> {
    return this.apiService.getRequest<ApolloMasterInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid(
    xuid: bigint,
  ): Observable<ApolloPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest<ApolloPlayerInventoryProfile[]>(
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
  public postGiftPlayers(gift: ApolloGroupGift): Observable<GiftResponse<bigint>[]> {
    return this.apiService.postRequest<GiftResponse<bigint>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask(
    gift: ApolloGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup(lspGroup: LspGroup, gift: ApolloGift): Observable<GiftResponse<bigint>> {
    return this.apiService.postRequest<GiftResponse<bigint>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
