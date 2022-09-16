import { Component, Input, ViewChild } from '@angular/core';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { PlayerNotification } from '@models/notifications.model';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';

/**
 *  Woodstock individual notification management component.
 */
@Component({
  selector: 'woodstock-individual-notification-management',
  templateUrl: './woodstock-individual-notification-management.component.html',
  styleUrls: [],
})
export class WoodstockIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  public service: IndividualNotificationManagementContract;
  constructor(woodstockService: WoodstockService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]> {
        return woodstockService.getPlayerNotifications$(xuid);
      },
      postEditPlayerCommunityMessage$(
        xuid: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return woodstockService.postEditPlayerCommunityMessage$(
          xuid,
          notificationId,
          communityMessage,
        );
      },
      deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
        return woodstockService.deletePlayerCommunityMessage$(xuid, notificationId);
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
