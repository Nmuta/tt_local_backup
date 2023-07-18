import { Injectable } from '@angular/core';
import { SafetyRating, SafetyRatingUpdate } from '@models/player-safety-rating.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/safetyRating endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerSafetyRatingService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player safety rating. */
  public getSafetyRatingByXuid$(xuid: BigNumber): Observable<SafetyRating> {
    return this.api.getRequest$<SafetyRating>(`${this.basePath}/${xuid}/safetyRating`);
  }

  /** Clears player safety rating. */
  public deleteSafetyRatingByXuid$(xuid: BigNumber): Observable<SafetyRating> {
    return this.api.deleteRequest$<SafetyRating>(`${this.basePath}/${xuid}/safetyRating`);
  }

  /** Sets player safety rating. */
  public setSafetyRatingByXuid$(
    xuid: BigNumber,
    safetyRatingUpdate: SafetyRatingUpdate,
  ): Observable<SafetyRating> {
    return this.api.postRequest$<SafetyRating>(
      `${this.basePath}/${xuid}/safetyRating`,
      safetyRatingUpdate,
    );
  }
}
