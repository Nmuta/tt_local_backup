import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadPlayerSkillRatingService } from '@services/api-v2/steelhead/player/skill-rating/steelhead-player-skill-rating.service';
import BigNumber from 'bignumber.js';
import { SkillRatingServiceContract } from '../skill-rating.component';

/**
 *  Steelhead skill rating component.
 */
@Component({
  selector: 'steelhead-skill-rating',
  templateUrl: './steelhead-skill-rating.component.html',
})
export class SteelheadSkillRatingComponent {
  /** Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Player profile. */
  @Input() public profile: FullPlayerInventoryProfile;

  public service: SkillRatingServiceContract;

  constructor(steelheadPlayerSkillRatingService: SteelheadPlayerSkillRatingService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getSkillRating$: (xuid: BigNumber, profileId: GuidLikeString) =>
        steelheadPlayerSkillRatingService.getSkillRating$(xuid, profileId),
      overrideSkillRating$: (xuid: BigNumber, profileId: GuidLikeString, skillRating: BigNumber) =>
        steelheadPlayerSkillRatingService.overrideSkillRating$(xuid, profileId, skillRating),
      clearSkillRatingOverride$: (xuid: BigNumber, profileId: GuidLikeString) =>
        steelheadPlayerSkillRatingService.clearSkillRatingOverride$(xuid, profileId),
    };
  }
}
