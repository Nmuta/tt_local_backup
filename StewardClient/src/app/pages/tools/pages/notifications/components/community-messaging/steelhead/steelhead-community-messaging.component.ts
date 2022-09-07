import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommunityMessagingComponent } from '../community-messaging.component';
import { GameTitle } from '@models/enums';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import { SteelheadPlayersMessagesService } from '@services/api-v2/steelhead/players/messages/steelhead-players-messages.service';

/**
 *  Steelhead community messaging component.
 */
@Component({
  selector: 'steelhead-community-messaging',
  templateUrl: '../community-messaging.component.html',
  styleUrls: ['../community-messaging.component.scss'],
})
export class SteelheadCommunityMessagingComponent extends CommunityMessagingComponent {
  public gameTitle = GameTitle.FM8;
  public lockStartTime = false;

  constructor(
    private readonly steelheadPlayersMessagesService: SteelheadPlayersMessagesService,
    private readonly steelheadGroupMessagesService: SteelheadGroupMessagesService,
  ) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    if (this.isUsingPlayerIdentities) {
      return this.steelheadPlayersMessagesService.postSendCommunityMessageToXuids$(
        this.playerIdentities.map(identity => identity.xuid),
        this.newCommunityMessage,
      );
    } else {
      return this.steelheadGroupMessagesService
        .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
        .pipe(switchMap(data => of([data])));
    }
  }
}
