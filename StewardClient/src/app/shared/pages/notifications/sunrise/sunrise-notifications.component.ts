import { Component, ViewChild } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import BigNumber from 'bignumber.js';
import { SunriseIndividualNotificationManagementComponent } from '../components/notification-management/individual-notification-management/sunrise/sunrise-individual-notification-management.component';
import { SunriseGroupNotificationManagementComponent } from '../components/notification-management/group-notification-management/sunrise/sunrise-group-notification-management.component';

/**
 *  Sunrise notification component.
 */
@Component({
  templateUrl: './sunrise-notifications.component.html',
  styleUrls: ['./sunrise-notifications.component.scss'],
})
export class SunriseNotificationsComponent {
  @ViewChild(SunriseGroupNotificationManagementComponent)
  private groupManagementComponent: SunriseGroupNotificationManagementComponent;
  @ViewChild(SunriseIndividualNotificationManagementComponent)
  private playerManagementComponent: SunriseIndividualNotificationManagementComponent;

  public gameTitle = GameTitleCodeName.FH4;
  /** The selected player identities */
  public playerIdentities: IdentityResultAlpha[] = [];
  /** The selected LSP Group ID. */
  public selectedLspGroup: LspGroup;
  /** The selected xuid. */
  public selectedXuid: BigNumber;
  /** True when player identities are being used. */
  public isUsingPlayerIdentities: boolean = true;
  /** True when Edit/Delete tab is selected. */
  public isInEditTab: boolean = false;

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
    if (this.playerIdentities.length === 1) {
      this.selectedXuid = this.playerIdentities[0]?.xuid;
    }
  }

  /** Logic for when a player is selected. */
  public onPlayerSelected(selected: AugmentedCompositeIdentity): void {
    if (this.playerIdentities.length === 1) {
      return;
    }

    this.selectedXuid = selected?.sunrise?.xuid;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return `Player does not have a Sunrise account at the selected endpoint. Player will be ignored.`;
    }

    return null;
  }

  /** Sets if tool is using player identities as selection type; */
  public playerSelectionTypeChange(tabIndex: number): void {
    this.isUsingPlayerIdentities = tabIndex === 0;
  }

  /** Reloads if group selection has changed.; */
  public viewSelectionTypeChange(tabIndex: number): void {
    if (tabIndex === 1) {
      this.isInEditTab = true;
      this.playerManagementComponent.refreshNotificationList();
      this.groupManagementComponent.refreshNotificationList();
    } else {
      this.isInEditTab = false;
    }
  }
}
