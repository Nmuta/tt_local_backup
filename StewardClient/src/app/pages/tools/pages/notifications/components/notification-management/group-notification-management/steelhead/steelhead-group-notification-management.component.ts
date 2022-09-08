import { Component, Input, ViewChild } from '@angular/core';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { GroupNotification } from '@models/notifications.model';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';

/**
 *  Steelhead group notification management component.
 */
@Component({
  selector: 'steelhead-group-notification-management',
  templateUrl: './steelhead-group-notification-management.component.html',
  styleUrls: [],
})
export class SteelheadGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  public service: GroupNotificationManagementContract;
  constructor(private readonly steelheadGroupMessagesService: SteelheadGroupMessagesService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]> {
        return this.steelheadGroupMessagesService.getGroupNotifications$(lspGroupId);
      },
      postEditLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return this.steelheadGroupMessagesService.postEditLspGroupCommunityMessage$(
          lspGroupId,
          notificationId,
          communityMessage,
        );
      },
      deleteLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
      ): Observable<void> {
        return this.steelheadGroupMessagesService.deleteLspGroupCommunityMessage$(
          lspGroupId,
          notificationId,
        );
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
