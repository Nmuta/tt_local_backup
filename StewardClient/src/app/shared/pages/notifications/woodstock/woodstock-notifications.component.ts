import { Component, ViewChild } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockNotificationManagementComponent } from '../components/notification-management/woodstock/woodstock-notification-management.component';

/**
 *  Woodstock community messaging component.
 */
@Component({
  templateUrl: './woodstock-notifications.component.html',
  styleUrls: ['./woodstock-notifications.component.scss'],
})
export class WoodstockNotificationsComponent {
  @ViewChild(WoodstockNotificationManagementComponent)
  private woodstockManagementComponent: WoodstockNotificationManagementComponent;

  public gameTitle = GameTitleCodeName.FH4;
  /** The selected player identities */
  public playerIdentities: IdentityResultAlpha[] = [];
  /** The selected LSP Group ID. */
  public selectedLspGroup: LspGroup;
  /** True when player identities are being used. */
  public isUsingPlayerIdentities: boolean = true;

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.playerIdentities = newIdentities;
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
      this.woodstockManagementComponent.refreshNotificationList();
    }
  }
}
