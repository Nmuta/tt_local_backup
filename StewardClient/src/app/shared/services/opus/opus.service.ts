import { Injectable } from '@angular/core';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { OpusMasterInventory, OpusPlayerDetails, OpusPlayerInventory, OpusPlayerInventoryProfile } from '@models/opus';
import { ApiService } from '@services/api';
import { chain } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class OpusService {
  public basePath: string = 'v1/title/opus';

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

  /** Gets opus player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<OpusPlayerDetails> {
    return this.apiService.getRequest<OpusPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets the opus player's inventory */
  public getPlayerInventoryByXuid(xuid: bigint): Observable<OpusMasterInventory> {
    return this.apiService.getRequest<OpusMasterInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid(xuid: bigint): Observable<OpusPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest<OpusPlayerInventoryProfile[]>(
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

  /** Gets a specific version of an apollo player's inventory */
  public getPlayerInventoryByProfileId(profileId: bigint): Observable<OpusPlayerInventory> {
    return this.apiService.getRequest<OpusPlayerInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }
}
