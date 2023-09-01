import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { LeaderboardScoreType } from '@models/leaderboards';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Interface that represents a rivals event. */
export interface RivalsEvent {
  id: BigNumber;
  name: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  scoreType: LeaderboardScoreType;
  trackName: string;
  carRestrictions: string[];
}

/** The /v2/title/steelhead/rivals endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadRivalsService {
  public readonly basePath: string = 'title/steelhead/rivals';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Rivals Events. */
  public getRivalsEventsByPegasus$(
    info: PegasusPathInfo
  ): Observable<RivalsEvent[]> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<RivalsEvent[]>(`${this.basePath}`, httpParams);
  }

  /** Gets Rivals Events. */
  public getRivalsEventsByUser$(xuid: BigNumber): Observable<RivalsEvent[]> {
    return this.api.getRequest$<RivalsEvent[]>(`${this.basePath}/player/${xuid}`);
  }

  /** Gets the Rivals Event reference. */
  public getRivalsEventReference$(): Observable<Map<GuidLikeString, string>> {
    return this.api.getRequest$<Map<GuidLikeString, string>>(`${this.basePath}/reference`);
  }

  /** Gets the Rivals Categories. */
  public getRivalsEventCategories$(): Observable<Map<GuidLikeString, string>> {
    return this.api.getRequest$<Map<GuidLikeString, string>>(`${this.basePath}/categories`);
  }
}
