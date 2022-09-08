import { Component, Input, ViewChild } from '@angular/core';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { PlayerNotification } from '@models/notifications.model';
import { SteelheadPlayerMessagesService } from '@services/api-v2/steelhead/player/messages/steelhead-player-messages.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';

/**
 *  Steelhead individual notification management component.
 */
@Component({
  selector: 'steelhead-individual-notification-management',
  templateUrl: './steelhead-individual-notification-management.component.html',
  styleUrls: [],
})
export class SteelheadIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  public service: IndividualNotificationManagementContract;
  constructor(steelheadPlayerMessagesService: SteelheadPlayerMessagesService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]> {
        return steelheadPlayerMessagesService.getPlayerNotifications$(xuid);
      },
      postEditPlayerCommunityMessage$(
        xuid: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return steelheadPlayerMessagesService.postEditPlayerCommunityMessage$(
          xuid,
          notificationId,
          communityMessage,
        );
      },
      deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
        return steelheadPlayerMessagesService.deletePlayerCommunityMessage$(xuid, notificationId);
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
