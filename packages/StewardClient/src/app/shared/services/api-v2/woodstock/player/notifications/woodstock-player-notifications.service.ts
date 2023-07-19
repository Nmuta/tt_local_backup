import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/woodstock/player/{xuid}/notifications endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayerNotificationsService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Set a player's report weight. */
  public deleteAllPlayerNotifications$(xuid: BigNumber): Observable<void> {
    return this.api.deleteRequest$<void>(`${this.basePath}/${xuid}/notifications`);
  }
}
