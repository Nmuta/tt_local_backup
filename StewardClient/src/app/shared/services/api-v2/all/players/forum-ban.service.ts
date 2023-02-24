import { Injectable } from '@angular/core';
import { ForumBanRequest } from '@models/forum-ban-request.model';
import { ForumBanSummary } from '@models/forum-ban-summary.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/multi/players/forumBan endpoints. */
@Injectable({
  providedIn: 'root',
})
export class ForumBanService {
  public readonly basePath: string = 'title/multi/players/forumBan';
  constructor(private readonly api: ApiV2Service) {}

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: ForumBanRequest[]): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}`, bans);
  }

  /** Gets players ban summaries with a list of XUIDs. */
  public getBanSummariesByXuids$(xuids: BigNumber[]): Observable<ForumBanSummary[]> {
    return this.api.postRequest$<ForumBanSummary[]>(`${this.basePath}/banSummaries`, xuids);
  }
}
