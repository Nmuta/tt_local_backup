import { Component, Input, ViewChild } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { ForceStartDateToUtcNowSelectionStrategy } from '@components/date-time-pickers/datetime-range-picker/date-range-selection-strategies';
import { CommunityMessage } from '@models/community-message';
import { GameTitle } from '@models/enums';
import { PlayerNotification } from '@models/notifications.model';
import { SunriseService } from '@services/sunrise';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { IndividualNotificationManagementComponent } from '../individual-notification-management.component';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';

/**
 *  Sunrise individual notification management component.
 */
@Component({
  selector: 'sunrise-individual-notification-management',
  templateUrl: './sunrise-individual-notification-management.component.html',
  styleUrls: [],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: ForceStartDateToUtcNowSelectionStrategy,
    },
  ],
})
export class SunriseIndividualNotificationManagementComponent {
  /** The selected xuid. */
  @Input() public selectedXuid: BigNumber;
  @ViewChild(IndividualNotificationManagementComponent)
  private managementComponent: IndividualNotificationManagementComponent;
  public service: IndividualNotificationManagementContract;
  constructor(private readonly sunriseService: SunriseService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]> {
        return sunriseService.getPlayerNotifications$(xuid);
      },
      postEditPlayerCommunityMessage$(
        xuid: BigNumber,
        notificationId: string,
        communityMessage: CommunityMessage,
      ): Observable<void> {
        return sunriseService.postEditPlayerCommunityMessage$(
          xuid,
          notificationId,
          communityMessage,
        );
      },
      deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
        return sunriseService.deletePlayerCommunityMessage$(xuid, notificationId);
      },
    };
  }

  /** Refresh notification list.  */
  public refreshNotificationList(): void {
    this.managementComponent.refreshNotificationList();
  }
}
