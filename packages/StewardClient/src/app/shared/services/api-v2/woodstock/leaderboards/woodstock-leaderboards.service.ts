import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Leaderboard } from '@models/leaderboards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/leaderboards endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockLeaderboardsService {
  public readonly basePath: string = 'title/woodstock/leaderboards';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets leaderboards. */
  public getLeaderboards$(pegasusEnvironment: string): Observable<Leaderboard[]> {
    const params = new HttpParams().set('pegasusEnvironment', pegasusEnvironment);

    return this.api.getRequest$<Leaderboard[]>(this.basePath, params);
  }
}
