import { Component, Input, ViewChild } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { ForceStartDateToUtcNowSelectionStrategy } from '@components/date-time-pickers/datetime-range-picker/date-range-selection-strategies';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { GroupNotification } from '@models/notifications.model';
import { SunriseService } from '@services/sunrise';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { GroupNotificationManagementComponent } from '../group-notification-management.component';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';

/**
 *  Sunrise group notification management component.
 */
@Component({
  selector: 'sunrise-group-notification-management',
  templateUrl: './sunrise-group-notification-management.component.html',
  styleUrls: [],
  providers: [
    GroupNotificationManagementComponent,
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: ForceStartDateToUtcNowSelectionStrategy,
    },
  ],
})
export class SunriseGroupNotificationManagementComponent {
  /** The selected LSP group. */
  @Input() public selectedLspGroup: LspGroup;
  @ViewChild(GroupNotificationManagementComponent)
  private managementComponent: GroupNotificationManagementComponent;
  public service: GroupNotificationManagementContract;
  constructor(private readonly sunriseService: SunriseService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]> {
        return this.sunriseService.getGroupNotifications$(lspGroupId);
      },
      postEditLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return this.sunriseService.postEditLspGroupCommunityMessage$(
          lspGroupId,
          notificationId,
          communityMessage,
        );
      },
      deleteLspGroupCommunityMessage$(
        lspGroupId: BigNumber,
        notificationId: string,
      ): Observable<void> {
        return this.sunriseService.deleteLspGroupCommunityMessage$(lspGroupId, notificationId);
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
