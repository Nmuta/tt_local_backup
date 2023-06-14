import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

export interface SkillRatingSummary {
  rawMean: BigNumber;
  normalizedMean: BigNumber;
  overriddenScore: BigNumber;
  isScoreOverridden: boolean;
  normalizationMin: BigNumber;
  normalizationMax: BigNumber;
}

/** The /v2/title/steelhead/player/{xuid}/profile/{profileId}/skillRating endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerSkillRatingService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player skill rating summary. */
  public getSkillRating$(
    xuid: BigNumber,
    profileId: GuidLikeString,
  ): Observable<SkillRatingSummary> {
    return this.api.getRequest$<SkillRatingSummary>(
      `${this.basePath}/${xuid}/profile/${profileId}/skillRating`,
    );
  }

  /** Sets player skill rating override. */
  public overrideSkillRating$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    skillOverride: BigNumber,
  ): Observable<SkillRatingSummary> {
    return this.api.postRequest$<SkillRatingSummary>(
      `${this.basePath}/${xuid}/profile/${profileId}/skillRating`,
      skillOverride,
    );
  }

  /** Clears player skill rating override. */
  public clearSkillRatingOverride$(
    xuid: BigNumber,
    profileId: GuidLikeString,
  ): Observable<SkillRatingSummary> {
    return this.api.deleteRequest$<SkillRatingSummary>(
      `${this.basePath}/${xuid}/profile/${profileId}/skillRating`,
    );
  }
}
