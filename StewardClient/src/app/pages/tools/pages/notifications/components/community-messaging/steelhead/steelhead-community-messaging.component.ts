import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SteelheadService } from '@services/steelhead';
import { CommunityMessagingComponent } from '../community-messaging.component';
import { GameTitleCodeName } from '@models/enums';

/**
 *  Steelhead community messaging component.
 */
@Component({
  selector: 'steelhead-community-messaging',
  templateUrl: '../community-messaging.component.html',
  styleUrls: ['../community-messaging.component.scss'],
})
export class SteelheadCommunityMessagingComponent extends CommunityMessagingComponent {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    if (this.isUsingPlayerIdentities) {
      return this.steelheadService.postSendCommunityMessageToXuids$(
        this.playerIdentities.map(identity => identity.xuid),
        this.newCommunityMessage,
      );
    } else {
      return this.steelheadService
        .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
        .pipe(switchMap(data => of([data])));
    }
  }
}
