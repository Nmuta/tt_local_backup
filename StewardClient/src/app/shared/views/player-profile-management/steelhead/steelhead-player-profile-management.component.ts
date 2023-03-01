import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerProfileService } from '@services/api-v2/steelhead/player/profile/steelhead-player-profile.service';
import { SteelheadProfileTemplatesService } from '@services/api-v2/steelhead/profile-templates/steelhead-profile-templates.service';
import { SteelheadUserGroupService } from '@services/api-v2/steelhead/user-group/steelhead-user-group.service';
import BigNumber from 'bignumber.js';
import {
  PlayerProfileManagementComponent,
  PlayerProfileManagementServiceContract,
} from '../player-profile-management.component';

/**
 *  Steelhead player profile component.
 */
@Component({
  selector: 'steelhead-player-profile-management',
  templateUrl: './steelhead-player-profile-management.component.html',
})
export class SteelheadPlayerProfileManagementComponent {
  @ViewChild(PlayerProfileManagementComponent) profileManagement: PlayerProfileManagementComponent;
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: External profile id. */
  @Input() public externalProfileId: GuidLikeString;
  /** REVIEW-COMMENT: Output when external profile id is updated. */
  @Output() public externalProfileIdUpdated = new EventEmitter<GuidLikeString>();

  public service: PlayerProfileManagementServiceContract;

  constructor(
    playerProfileService: SteelheadPlayerProfileService,
    userGroupService: SteelheadUserGroupService,
    profileTemplateService: SteelheadProfileTemplatesService,
  ) {
    this.service = {
      gameTitle: GameTitle.FM8,
      employeeGroupId: new BigNumber(4),
      getUserGroupMembership$: (userGroupId, xuid) =>
        userGroupService.getUserGroupMembership$(userGroupId, xuid),
      getPlayerProfileTemplates$: () => profileTemplateService.getProfileTemplates$(),
      savePlayerProfileTemplate$: (xuid, profileId, templateName, overwriteIfExists) =>
        playerProfileService.savePlayerProfileTemplate$(
          xuid,
          profileId,
          templateName,
          overwriteIfExists,
        ),
      loadTemplateToPlayerProfile$: (
        xuid,
        profileId,
        templateName,
        continueOnBreakingChanges,
        forzaSandbox,
      ) =>
        playerProfileService.loadTemplateToPlayerProfile$(
          xuid,
          profileId,
          templateName,
          continueOnBreakingChanges,
          forzaSandbox,
        ),
      resetPlayerProfile$: (xuid, profileId, options) =>
        playerProfileService.resetPlayerProfile$(xuid, profileId, options),
    };
  }

  /** Reverifies user group membership. */
  public checkUserGroupMembership(): void {
    this.profileManagement.checkUserGroupMembership();
  }
}
