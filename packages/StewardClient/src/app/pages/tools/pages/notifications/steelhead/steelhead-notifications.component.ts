import { Component, ViewChild } from '@angular/core';
import { GameTitle } from '@models/enums';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { LspGroup } from '@models/lsp-group';
import { IdentityResultAlpha } from '@models/identity-query.model';
import BigNumber from 'bignumber.js';
import { LocalizedMessagingContract } from '../components/localized-messaging/localized-messaging.component';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
import { Observable } from 'rxjs';
import { SteelheadPlayersMessagesService } from '@shared/services/api-v2/steelhead/players/messages/steelhead-players-messages.service';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { CreateLocalizedStringContract } from '@components/localization/create-localized-string/create-localized-string.component';
import { LocalizedStringsMap, LocalizedStringData } from '@models/localization';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { SteelheadPlayerMessagesService } from '@services/api-v2/steelhead/player/messages/steelhead-player-messages.service';
import {
  LocalizedGroupNotification,
  LocalizedPlayerNotification,
} from '@models/notifications.model';
import { renderGuard } from '@helpers/rxjs';
import {
  LocalizedGroupMessagingManagementContract,
  LocalizedGroupNotificationManagementComponent,
} from '../components/notification-management/localized-group-notification-management/localized-group-notification-management.component';
import {
  LocalizedIndividualMessagingManagementContract,
  LocalizedIndividualNotificationManagementComponent,
} from '../components/notification-management/localized-individual-notification-management/localized-individual-notification-management.component';
import { PullRequest, PullRequestSubject } from '@models/git-operation';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

/**
 *  Steelhead notification component.
 */
@Component({
  templateUrl: './steelhead-notifications.component.html',
  styleUrls: ['./steelhead-notifications.component.scss'],
})
export class SteelheadNotificationsComponent {
  @ViewChild(LocalizedIndividualNotificationManagementComponent)
  private playerManagementComponent: LocalizedIndividualNotificationManagementComponent;
  @ViewChild(LocalizedGroupNotificationManagementComponent)
  private groupManagementComponent: LocalizedGroupNotificationManagementComponent;

  public sendMessageServiceContract: LocalizedMessagingContract;
  public localizationCreationServiceContract: CreateLocalizedStringContract;
  public localizationSelectionServiceContract: SelectLocalizedStringContract;
  public localizedIndividualMessagingManagementServiceContract: LocalizedIndividualMessagingManagementContract;
  public localizedGroupMessagingManagementServiceContract: LocalizedGroupMessagingManagementContract;

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

  // Loc string active PRs display
  public newLocStringActivePullRequest: PullRequest;
  public locStringActivePrSubject = PullRequestSubject.LocalizationString;
  public readonly permAttributeLocString = PermAttributeName.AddLocalizedString;

  constructor(
    steelheadPlayersMessagesService: SteelheadPlayersMessagesService,
    steelheadGroupMessagesService: SteelheadGroupMessagesService,
    steelheadLocalizationService: SteelheadLocalizationService,
    steelheadPlayerMessagesService: SteelheadPlayerMessagesService,
  ) {
    this.localizationCreationServiceContract = {
      gameTitle: this.gameTitle,
      postStringForLocalization$(
        localizedStringData: LocalizedStringData,
      ): Observable<PullRequest> {
        return steelheadLocalizationService.postLocalizedString$(localizedStringData);
      },
    };

    this.localizationSelectionServiceContract = {
      gameTitle: this.gameTitle,
      getLocalizedStrings$(): Observable<LocalizedStringsMap> {
        return steelheadLocalizationService.getLocalizedStrings$(false);
      },
    };

    this.sendMessageServiceContract = {
      gameTitle: this.gameTitle,
      lockStartTime: false,
      sendLocalizedMessage$(
        xuids: BigNumber[],
        localizedMessage: LocalizedMessage,
      ): Observable<CommunityMessageResult<BigNumber>[]> {
        return steelheadPlayersMessagesService.postSendLocalizedMessageToXuids$(
          xuids,
          localizedMessage,
        );
      },
      sendLspLocalizedMessage$(
        lspGroupId: BigNumber,
        localizedMessage: LocalizedMessage,
      ): Observable<CommunityMessageResult<BigNumber>> {
        return steelheadGroupMessagesService.postSendLocalizedMessageToLspGroup$(
          lspGroupId,
          localizedMessage,
        );
      },
      selectLocalizedStringContract: {
        gameTitle: this.gameTitle,
        getLocalizedStrings$(): Observable<LocalizedStringsMap> {
          return steelheadLocalizationService.getLocalizedStrings$(false);
        },
      },
    };

    this.localizedIndividualMessagingManagementServiceContract = {
      gameTitle: this.gameTitle,
      selectLocalizedStringService: this.localizationSelectionServiceContract,
      getPlayerNotifications$(xuid: BigNumber): Observable<LocalizedPlayerNotification[]> {
        return steelheadPlayerMessagesService.getPlayerNotifications$(xuid);
      },
      postEditPlayerCommunityMessage$(
        xuid: BigNumber,
        notificationId: string,
        localizedMessage: LocalizedMessage,
      ): Observable<void> {
        return steelheadPlayerMessagesService.postEditPlayerLocalizedMessage$(
          xuid,
          notificationId,
          localizedMessage,
        );
      },
      deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
        return steelheadPlayerMessagesService.deletePlayerLocalizedMessage$(xuid, notificationId);
      },
    };

    this.localizedGroupMessagingManagementServiceContract = {
      gameTitle: this.gameTitle,
      selectLocalizedStringService: this.localizationSelectionServiceContract,
      getGroupNotifications$(lspGroupId: BigNumber): Observable<LocalizedGroupNotification[]> {
        return steelheadGroupMessagesService.getGroupNotifications$(lspGroupId);
      },
      postEditLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
        localizedMessage: LocalizedMessage,
      ): Observable<void> {
        return steelheadGroupMessagesService.postEditLspGroupLocalizedMessage$(
          lspGroupId,
          notificationId,
          localizedMessage,
        );
      },
      deleteLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
      ): Observable<void> {
        return steelheadGroupMessagesService.deleteLspGroupLocalizedMessage$(
          lspGroupId,
          notificationId,
        );
      },
    };
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

    renderGuard(() => {
      this.playerManagementComponent?.refreshNotificationList();
      this.groupManagementComponent?.refreshNotificationList();
    });
  }

  /** Reloads if group selection has changed.; */
  public viewSelectionTypeChange(tabIndex: number): void {
    if (tabIndex === 2) {
      this.isInEditTab = true;
      this.playerManagementComponent?.refreshNotificationList();
      this.groupManagementComponent?.refreshNotificationList();
    } else {
      this.isInEditTab = false;
    }
  }
}
