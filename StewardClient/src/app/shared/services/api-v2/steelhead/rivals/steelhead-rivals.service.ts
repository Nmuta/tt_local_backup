import { Injectable } from '@angular/core';
import { LeaderboardScoreType } from '@models/leaderboards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** Interface that represents a rivals event. */
export interface RivalsEvent {
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
  public getRivalsEvents$(): Observable<RivalsEvent[]> {
    return this.api.getRequest$<RivalsEvent[]>(`${this.basePath}`);
  }
}