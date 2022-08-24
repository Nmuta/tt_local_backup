import { Component, ViewChild } from '@angular/core';
import { GameTitle } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockGroupNotificationManagementComponent } from '../components/notification-management/group-notification-management/woodstock/woodstock-group-notification-management.component';
import { WoodstockIndividualNotificationManagementComponent } from '../components/notification-management/individual-notification-management/woodstock/woodstock-individual-notification-management.component';
import BigNumber from 'bignumber.js';

/**
 *  Woodstock notification component.
 */
@Component({
  templateUrl: './woodstock-notifications.component.html',
  styleUrls: ['./woodstock-notifications.component.scss'],
})
export class WoodstockNotificationsComponent {
  @ViewChild(WoodstockGroupNotificationManagementComponent)
  private groupManagementComponent: WoodstockGroupNotificationManagementComponent;
  @ViewChild(WoodstockIndividualNotificationManagementComponent)
  private playerManagementComponent: WoodstockIndividualNotificationManagementComponent;

  public gameTitle = GameTitle.FH4;
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
    const newIdentities = identities.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
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

    this.selectedXuid = selected?.woodstock?.xuid;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return `Player does not have a Woodstock account at the selected endpoint. Player will be ignored.`;
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
