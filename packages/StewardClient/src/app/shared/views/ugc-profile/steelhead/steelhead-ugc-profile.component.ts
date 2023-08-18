import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import BigNumber from 'bignumber.js';
import { UgcProfileServiceContract } from '../ugc-profile.component';
import { SteelheadPlayerUgcProfileService } from '@services/api-v2/steelhead/player/ugc-profile/steelhead-player-ugc-profile.service';

/**
 *  Steelhead UGC profile component.
 */
@Component({
  selector: 'steelhead-ugc-profile',
  templateUrl: './steelhead-ugc-profile.component.html',
})
export class SteelheadUgcProfileComponent {
  /** Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Player profile. */
  @Input() public profile: FullPlayerInventoryProfile;

  public service: UgcProfileServiceContract;

  constructor(steelheadPlayerSkillRatingService: SteelheadPlayerUgcProfileService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getUgcProfile$: (xuid: BigNumber, profileId: GuidLikeString) =>
        steelheadPlayerSkillRatingService.getUgcProfile$(xuid, profileId),
      updateUgcProfile$: (xuid: BigNumber, profileId: GuidLikeString, profileData: string) =>
        steelheadPlayerSkillRatingService.updateUgcProfile$(xuid, profileId, profileData),
    };
  }
}
