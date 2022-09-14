import { Component, ViewChild } from '@angular/core';
import { GameTitle } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import BigNumber from 'bignumber.js';
import { SteelheadGroupNotificationManagementComponent } from '../components/notification-management/group-notification-management/steelhead/steelhead-group-notification-management.component';
import { SteelheadIndividualNotificationManagementComponent } from '../components/notification-management/individual-notification-management/steelhead/steelhead-individual-notification-management.component';
import { LocalizedMessagingContract } from '../components/localized-messaging/localized-messaging.component';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
import { Observable } from 'rxjs';

/**
 *  Steelhead notification component.
 */
@Component({
  templateUrl: './steelhead-notifications.component.html',
  styleUrls: ['./steelhead-notifications.component.scss'],
})
export class SteelheadNotificationsComponent {
  @ViewChild(SteelheadGroupNotificationManagementComponent)
  private groupManagementComponent: SteelheadGroupNotificationManagementComponent;
  @ViewChild(SteelheadIndividualNotificationManagementComponent)
  private playerManagementComponent: SteelheadIndividualNotificationManagementComponent;

  public service: LocalizedMessagingContract;

  public gameTitle = GameTitle.FM8;
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

  constructor(steelheadPlayersMessagesService: SteelheadPlayersMessagesService) {
    this.service = {
      gameTitle: this.gameTitle,
      lockStartTime: false,
      sendLocalizedMessage$(
        xuids: BigNumber[],
        localizedMessage: LocalizedMessage): Observable<CommunityMessageResult<BigNumber>[]>
      {
        return steelheadPlayersMessagesService.postSendCommunityMessageToXuids$(xuids, localizedMessage);
      }
    }

  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSteelhead).map(i => i.steelhead);
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

    this.selectedXuid = selected?.steelhead?.xuid;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSteelhead) {
      return `Player does not have a Steelhead account at the selected endpoint. Player will be ignored.`;
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
