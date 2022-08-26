import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WoodstockService } from '@services/woodstock';
import { CommunityMessagingComponent } from '../community-messaging.component';
import { GameTitle } from '@models/enums';

/**
 *  Woodstock community messaging component.
 */
@Component({
  selector: 'woodstock-community-messaging',
  templateUrl: '../community-messaging.component.html',
  styleUrls: ['../community-messaging.component.scss'],
})
export class WoodstockCommunityMessagingComponent extends CommunityMessagingComponent {
  public gameTitle = GameTitle.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    if (this.isUsingPlayerIdentities) {
      return this.woodstockService.postSendCommunityMessageToXuids$(
        this.playerIdentities.map(identity => identity.xuid),
        this.newCommunityMessage,
      );
    } else {
      return this.woodstockService
        .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
        .pipe(switchMap(data => of([data])));
    }
  }
}
