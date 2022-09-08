import { Component, Input, ViewChild } from '@angular/core';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { GroupNotification } from '@models/notifications.model';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';

/**
 *  Woodstock group notification management component.
 */
@Component({
  selector: 'woodstock-group-notification-management',
  templateUrl: './woodstock-group-notification-management.component.html',
  styleUrls: [],
  providers: [GroupNotificationManagementComponent],
})
export class WoodstockGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  public service: GroupNotificationManagementContract;
  constructor(private readonly woodstockService: WoodstockService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]> {
        return this.woodstockService.getGroupNotifications$(lspGroupId);
      },
      postEditLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return this.woodstockService.postEditLspGroupCommunityMessage$(
          lspGroupId,
          notificationId,
          communityMessage,
        );
      },
      deleteLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
      ): Observable<void> {
        return this.woodstockService.deleteLspGroupCommunityMessage$(lspGroupId, notificationId);
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
