import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SafetyRatingUpdate } from '@models/player-safety-rating.model';
import { SteelheadPlayerSafetyRatingService } from '@services/api-v2/steelhead/player/safety-rating/steelhead-player-safety-rating.service';
import BigNumber from 'bignumber.js';
import { SafetyRatingServiceContract } from '../safety-rating.component';

/**
 *  Steelhead safety rating component.
 */
@Component({
  selector: 'steelhead-safety-rating',
  templateUrl: './steelhead-safety-rating.component.html',
})
export class SteelheadSafetyRatingComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: SafetyRatingServiceContract;

  constructor(steelheadPlayerSafetyRatingService: SteelheadPlayerSafetyRatingService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getSafetyRating$: xuid => steelheadPlayerSafetyRatingService.getSafetyRatingByXuid$(xuid),
      setSafetyRating$: (xuid: BigNumber, safetyRatingUpdate: SafetyRatingUpdate) =>
        steelheadPlayerSafetyRatingService.setSafetyRatingByXuid$(xuid, safetyRatingUpdate),
    };
  }
}
