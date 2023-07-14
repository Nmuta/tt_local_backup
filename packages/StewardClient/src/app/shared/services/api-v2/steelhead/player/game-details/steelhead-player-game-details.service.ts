import { Injectable } from '@angular/core';
import { PlayerGameDetails } from '@models/player-game-details.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/ endpoints to get player details. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerGameDetailsService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user game details. */
  public getUserGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails> {
    return this.api.getRequest$<PlayerGameDetails>(`${this.basePath}/xuid/${xuid}/gamedetails`);
  }
}
