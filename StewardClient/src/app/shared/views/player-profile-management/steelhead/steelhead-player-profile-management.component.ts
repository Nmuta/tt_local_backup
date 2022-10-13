import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerProfileService } from '@services/api-v2/steelhead/player/profile/steelhead-player-profile.service';
import { SteelheadProfileTemplatesService } from '@services/api-v2/steelhead/profile-templates/steelhead-profile-templates.service';
import { PlayerProfileManagementServiceContract } from '../player-profile-management.component';

/**
 *  Steelhead player profile component.
 */
@Component({
  selector: 'steelhead-player-profile-management',
  templateUrl: './steelhead-player-profile-management.component.html',
})
export class SteelheadPlayerProfileManagementComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: External profile id. */
  @Input() public externalProfileId: GuidLikeString;
  /** REVIEW-COMMENT: Output when external profile id is updated. */
  @Output() public externalProfileIdUpdated = new EventEmitter<GuidLikeString>();

  public service: PlayerProfileManagementServiceContract;

  constructor(
    playerProfileService: SteelheadPlayerProfileService,
    profileTemplateService: SteelheadProfileTemplatesService,
  ) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerProfileTemplates$: () => profileTemplateService.getProfileTemplates$(),
      savePlayerProfileTemplate$: (xuid, profileId, templateName, overwriteIfExists) =>
        playerProfileService.savePlayerProfileTemplate$(
          xuid,
          profileId,
          templateName,
          overwriteIfExists,
        ),
      loadTemplateToPlayerProfile$: (xuid, profileId, templateName, continueOnBreakingChanges) =>
        playerProfileService.loadTemplateToPlayerProfile$(
          xuid,
          profileId,
          templateName,
          continueOnBreakingChanges,
        ),
      resetPlayerProfile$: (xuid, profileId, options) =>
        playerProfileService.resetPlayerProfile$(xuid, profileId, options),
    };
  }
}
