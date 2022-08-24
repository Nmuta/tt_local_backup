import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SunriseService } from '@services/sunrise';
import { CommunityMessagingComponent } from '../community-messaging.component';
import { GameTitle } from '@models/enums';

/**
 *  Sunrise community messaging component.
 */
@Component({
  selector: 'sunrise-community-messaging',
  templateUrl: '../community-messaging.component.html',
  styleUrls: ['../community-messaging.component.scss'],
})
export class SunriseCommunityMessagingComponent extends CommunityMessagingComponent {
  public gameTitle = GameTitle.FH4;

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
