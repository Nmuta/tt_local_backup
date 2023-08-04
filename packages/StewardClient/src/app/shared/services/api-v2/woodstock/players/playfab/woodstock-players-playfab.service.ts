import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Represents a PlayFab player profile with master and title account id. */
export interface PlayFabProfile {
  master: string;
  title: string;
}

/** The /v2/woodstock/players/playfab endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayersPlayFabService {
  public readonly basePath: string = 'title/woodstock/players/playfab';
  constructor(private readonly api: ApiV2Service) {}

  /** Get PlayFab player ids from list of XUIDs. */
  public getPlayFabIds$(xuids: BigNumber[]): Observable<Map<BigNumber, PlayFabProfile>> {
    return this.api.postRequest$<Map<BigNumber, PlayFabProfile>>(`${this.basePath}/ids`, xuids);
  }
}
