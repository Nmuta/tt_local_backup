import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import BigNumber from 'bignumber.js';
import { LocalizedMessagingContract } from '../components/localized-messaging/localized-messaging.component';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import { SteelheadPlayersMessagesService } from '@shared/services/api-v2/steelhead/players/messages/steelhead-players-messages.service'
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { LocalizedStringData } from '@models/localization';

/**
 *  Steelhead notification component.
 */
@Component({
  templateUrl: './steelhead-notifications.component.html',
  styleUrls: ['./steelhead-notifications.component.scss'],
})
export class SteelheadNotificationsComponent {
  // @ViewChild(SteelheadGroupNotificationManagementComponent)
  // private groupManagementComponent: SteelheadGroupNotificationManagementComponent;
  // @ViewChild(SteelheadIndividualNotificationManagementComponent)
  // private playerManagementComponent: SteelheadIndividualNotificationManagementComponent;

  public sendMessageService: LocalizedMessagingContract;
  public localizationService: CreateLocalizedStringContract;

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

  constructor(
    steelheadPlayersMessagesService: SteelheadPlayersMessagesService,
    steelheadGroupMessagesService: SteelheadGroupMessagesService,
    steelheadLocalizationService: SteelheadLocalizationService) {
    this.sendMessageService = {
      gameTitle: this.gameTitle,
      lockStartTime: false,
      sendLocalizedMessage$(
        xuids: BigNumber[],
        localizedMessage: LocalizedMessage): Observable<CommunityMessageResult<BigNumber>[]>
      {
        return steelheadPlayersMessagesService.postSendLocalizedMessageToXuids$(xuids, localizedMessage);
      },
      sendLspLocalizedMessage$(lspGroupId: BigNumber, localizedMessage: LocalizedMessage): Observable<CommunityMessageResult<BigNumber>>
      {
        return steelheadGroupMessagesService.postSendLocalizedMessageToLspGroup$(lspGroupId, localizedMessage);
      }
    }

    this.localizationService = {
      gameTitle: this.gameTitle,
      postLocalizedString$(localizedStringData: LocalizedStringData): Observable<void>
      {
        return steelheadLocalizationService.postLocalizedString$(localizedStringData);
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
      //this.playerManagementComponent.refreshNotificationList();
      //this.groupManagementComponent.refreshNotificationList();
    } else {
      this.isInEditTab = false;
    }
  }
}
