import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SunriseService } from '@services/sunrise';
import { CommunityMessagingComponent } from '../community-messaging.component';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { GameTitle } from '@models/enums';
import { ForceStartDateToUtcNowSelectionStrategy } from '@components/date-time-pickers/datetime-range-picker/date-range-selection-strategies';

/**
 *  Sunrise community messaging component.
 */
@Component({
  selector: 'sunrise-community-messaging',
  templateUrl: '../community-messaging.component.html',
  styleUrls: ['../community-messaging.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: ForceStartDateToUtcNowSelectionStrategy,
    },
  ],
})
export class SunriseCommunityMessagingComponent extends CommunityMessagingComponent {
  public gameTitle = GameTitle.FH4;
  public lockStartTime = true;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    if (this.isUsingPlayerIdentities) {
      return this.sunriseService.postSendCommunityMessageToXuids$(
        this.playerIdentities.map(identity => identity.xuid),
        this.newCommunityMessage,
      );
    } else {
      return this.sunriseService
        .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
        .pipe(switchMap(data => of([data])));
    }
  }
}
