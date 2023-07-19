import { Injectable } from '@angular/core';
import { LiveOpsBanDescription } from '@models/forum-ban-history.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/forum/player/{xuid}/banHistory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class ForumBanHistoryService {
  public readonly basePath: string = 'title/forum/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.api.getRequest$<LiveOpsBanDescription[]>(`${this.basePath}/${xuid}/banHistory`);
  }
}
