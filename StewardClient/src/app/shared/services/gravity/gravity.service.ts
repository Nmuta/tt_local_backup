import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { GuidLikeString, T10IdString } from '@models/extended-types';
import {
  GravityGiftHistory,
  GravityPlayerDetails,
  GravityPlayerInventory,
  GravityPseudoPlayerInventoryProfile,
  gravitySaveStatesToPsuedoInventoryProfile,
} from '@models/gravity';
import { GravityGift } from '@models/gravity/gravity-gift.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import {
  IdentityQueryBeta,
  IdentityQueryBetaBatch,
  IdentityResultBeta,
  IdentityResultBetaBatch,
} from '@models/identity-query.model';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/** Defines the gravity service. */
@Injectable({
  providedIn: 'root',
})
export class GravityService {
  public basePath: string = 'v1/title/gravity';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getPlayerIdentity(identityQuery: IdentityQueryBeta): Observable<IdentityResultBeta> {
    const queryBatch: IdentityQueryBetaBatch = [identityQuery];
    return this.getPlayerIdentities(queryBatch).pipe(
      switchMap((data: IdentityResultBetaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities(
    identityQueries: IdentityQueryBetaBatch,
  ): Observable<IdentityResultBetaBatch> {
    return this.apiService.postRequest<IdentityResultBetaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
    );
  }

  /** Gets gravity player details with a gamertag. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<GravityPlayerDetails> {
    return this.apiService.getRequest<GravityPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets gravity player details with a T10 ID. */
  public getPlayerDetailsByT10Id(t10Id: string): Observable<GravityPlayerDetails> {
    return this.apiService.getRequest<GravityPlayerDetails>(
      `${this.basePath}/player/t10Id(${t10Id})/details`,
    );
  }

  /** Gets the gravity player's inventory */
  public getPlayerInventoryByT10Id(t10Id: T10IdString): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/t10Id(${t10Id})/inventory`,
    );
  }

  /** Gets a player's profile list by T10Id. */
  public getPlayerInventoryProfilesByT10Id(
    t10Id: GuidLikeString,
  ): Observable<GravityPseudoPlayerInventoryProfile[]> {
    return this.getPlayerDetailsByT10Id(t10Id).pipe(
      map(details => gravitySaveStatesToPsuedoInventoryProfile(details)),
    );
  }

  /** Gets a specific version of a player's inventory */
  public getPlayerInventoryByT10IdAndProfileId(
    t10Id: string,
    profileId: bigint,
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/t10Id(${t10Id})/profileId(${profileId})/inventory`,
    );
  }

  /** Gets gravity game settings. */
  public getMasterInventory(gameSettingsId: string): Observable<GravityMasterInventory> {
    return this.apiService.getRequest<GravityMasterInventory>(
      `${this.basePath}/masterInventory/gameSettingsId(${gameSettingsId})`,
    );
  }

  /** Gets Gift history by a Turn 10 ID. */
  public getGiftHistoryByT10Id(t10Id: string): Observable<GravityGiftHistory[]> {
    return this.apiService.getRequest<GravityGiftHistory[]>(
      `${this.basePath}/player/t10Id(${t10Id})/giftHistory`,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayerUsingBackgroundTask(
    t10Id: string,
    gift: GravityGift,
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', 'true');
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/gifting/t10Id(${t10Id})`,
      gift,
      params,
    );
  }
}
