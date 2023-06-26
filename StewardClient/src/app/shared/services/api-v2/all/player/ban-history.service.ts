import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/multi/player/{xuid}/banHistory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class MultipleBanHistoryService {
  public readonly basePath: string = 'title/multi/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets ban history by a XUID. */
  public getBanHistoriesByXuid$(xuid: BigNumber): Observable<Map<string, number>> {
    return this.api.getRequest$<Map<string, number>>(`${this.basePath}/${xuid}/banHistory`);
  }
}
