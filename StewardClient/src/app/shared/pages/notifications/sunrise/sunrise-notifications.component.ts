import { Component, ViewChild } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseNotificationManagementComponent } from '../components/notification-management/sunrise/sunrise-notification-management.component';

/**
 *  Sunrise community messaging component.
 */
@Component({
  templateUrl: './sunrise-notifications.component.html',
  styleUrls: ['./sunrise-notifications.component.scss'],
})
export class SunriseNotificationsComponent {
  @ViewChild(SunriseNotificationManagementComponent)
  private sunriseManagementComponent: SunriseNotificationManagementComponent;

  public gameTitle = GameTitleCodeName.FH4;
  /** The selected player identities */
  public playerIdentities: IdentityResultAlpha[] = [];
  /** The selected LSP Group ID. */
  public selectedLspGroup: LspGroup;
  /** True when player identities are being used. */
  public isUsingPlayerIdentities: boolean = true;

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
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
      this.sunriseManagementComponent.refreshNotificationList();
    }
  }
}
