import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HideableUgc } from '@models/hideable-ugc.model';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/reportWeight endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerUgcService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get a player's report weight. */
  public getPlayerUgcByType$(xuid: BigNumber, contentType: UgcType): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());
    return this.api.getRequest$<PlayerUgcItem[]>(`${this.basePath}/${xuid}/ugc`, httpParams);
  }

  /** Get a player's report weight. */
  public getPlayerHiddenUgc$(xuid: BigNumber): Observable<HideableUgc[]> {
    return this.api.getRequest$<HideableUgc[]>(`${this.basePath}/${xuid}/ugc/hidden`);
  }
}
