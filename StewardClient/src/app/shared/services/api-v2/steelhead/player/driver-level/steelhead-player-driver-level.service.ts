import { Injectable } from '@angular/core';
import { PlayerDriverLevel } from '@models/player-driver-level.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/driverLevel endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerDriverLevelService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player driver level. */
  public getDriverLevelByXuid$(xuid: BigNumber): Observable<PlayerDriverLevel> {
    return this.api.getRequest$<PlayerDriverLevel>(`${this.basePath}/${xuid}/driverLevel`);
  }

  /** Sets player driver level. */
  public setDriverLevelByXuid$(
    xuid: BigNumber,
    driverLevel: PlayerDriverLevel,
  ): Observable<PlayerDriverLevel> {
    return this.api.postRequest$<PlayerDriverLevel>(
      `${this.basePath}/${xuid}/driverLevel`,
      driverLevel,
    );
  }
}
