import { Injectable } from '@angular/core';
import { T10IdString } from '@models/extended-types';
import { GravityGiftHistory, GravityPlayerDetails, GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import {
  IdentityQueryBeta,
  IdentityQueryBetaBatch,
  IdentityResultBeta,
  IdentityResultBetaBatch,
} from '@models/identity-query.model';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
    return this.apiService
      .getRequest<GravityPlayerDetails>(`${this.basePath}/player/gamertag(${gamertag})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets gravity player details with a T10 ID. */
  public getPlayerDetailsByT10Id(t10Id: string): Observable<GravityPlayerDetails> {
    return this.apiService
      .getRequest<GravityPlayerDetails>(`${this.basePath}/player/t10Id(${t10Id})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets the gravity player's inventory */
  public getPlayerInventoryByT10Id(t10Id: T10IdString): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/t10Id(${t10Id})/inventory`,
    );
  }

  /** Gets gravity player inventory with a profile ID. */
  public getPlayerInventoryByProfileIdWithT10Id(
    t10Id: string,
    profileId: string,
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/t10Id(${t10Id})/profileId(${profileId})/inventory`,
    );
  }

  /** Gets gravity game settings. */
  public getGameSettings(gameSettingsId: string): Observable<GravityMasterInventory> {
    return this.apiService.getRequest<GravityMasterInventory>(
      `${this.basePath}/data/gameSettingsId(${gameSettingsId})`,
    );
  }

  /** Gets Gift history by a Turn 10 ID. */
  public getGiftHistoryByT10Id(t10Id: string): Observable<GravityGiftHistory[]> {
    return this.apiService.getRequest<GravityGiftHistory[]>(
      `${this.basePath}/player/t10Id(${t10Id})/giftHistory`,
    );
  }
}
