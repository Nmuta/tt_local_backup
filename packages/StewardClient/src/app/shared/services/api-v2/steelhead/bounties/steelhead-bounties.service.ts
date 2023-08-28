import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { RivalsEvent } from '../rivals/steelhead-rivals.service';
import { DateTime } from 'luxon';
import { LeaderboardScore, LeaderboardScoreType } from '@models/leaderboards';
import { HttpParams } from '@angular/common/http';

/** Interface that represents a bounty summary. */
export interface BountySummary {
  uniqueId: GuidLikeString;
  messageTitle: string;
  messageDescription: string;
  rivalsEventId: BigNumber;
  rivalsEventTitle: string;
  rivalsEventDescription: string;
  target: BigNumber;
}

/** Interface that represents a bounty. */
export interface BountyDetail {
  rivalsEvent: RivalsEvent;
  messageTitle: string;
  messageDescription: string;
  endTime: DateTime;
  target: BigNumber;
  userGroupId: BigNumber;
  playerRewardedCount: BigNumber;
  trackId: BigNumber;
  rewards: string[];
  phase: string;
}

/** The /v2/title/steelhead/bounties endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBountiesService {
  public readonly basePath: string = 'title/steelhead/bounty';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the bounty summaries. */
  public getBountySummaries$(): Observable<BountySummary[]> {
    return this.api.getRequest$<BountySummary[]>(`${this.basePath}/summaries`);
  }

  /** Gets the bounty detail. */
  public getBountyDetail$(bountyId: string): Observable<BountyDetail> {
    return this.api.getRequest$<BountyDetail>(`${this.basePath}/${bountyId}`);
  }

  /** Gets bounty threshold entry. */
  public getBountyThresholdEntry$(
    scoreTypeId: LeaderboardScoreType,
    trackId: BigNumber,
    pivotId: BigNumber,
    target: BigNumber,
  ): Observable<LeaderboardScore> {
    const params = new HttpParams()
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('target', target.toString());

    return this.api.getRequest$<LeaderboardScore>(`${this.basePath}/thresholdEntry`, params);
  }
}
