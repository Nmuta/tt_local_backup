import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Interface that represents a bounty summary. */
export interface BountySummary {
  uniqueId: GuidLikeString;
  messageTitle: string;
  messageDescription: string;
  rivalsEventId: BigNumber;
  rivalsEventTitle: string;
  rivalsEventDescription: string;
  target: string;
}

/** The /v2/title/steelhead/bounties endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBountiesService {
  public readonly basePath: string = 'title/steelhead/bounties';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the bounty summaries. */
  public getBountySummaries$(): Observable<BountySummary[]> {
    return this.api.getRequest$<BountySummary[]>(`${this.basePath}/bountySummaries`);
  }
}
