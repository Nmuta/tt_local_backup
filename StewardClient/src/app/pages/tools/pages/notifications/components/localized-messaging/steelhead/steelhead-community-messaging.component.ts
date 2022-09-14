import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LocalizedMessagingComponent } from '../localized-messaging.component';
import { GameTitle } from '@models/enums';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
import { SteelheadPlayersMessagesService } from '@services/api-v2/steelhead/players/messages/steelhead-players-messages.service';

/**
 *  Steelhead localized messaging component.
 */
@Component({
  selector: 'steelhead-localized-messaging',
  templateUrl: '../localized-messaging.component.html',
  styleUrls: ['../localized-messaging.component.scss'],
})
export class SteelheadLocalizedMessagingComponent extends LocalizedMessagingComponent {
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
        this.newLocalizedMessage,
      );
    } else {
      return this.steelheadGroupMessagesService
        .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newLocalizedMessage)
        .pipe(switchMap(data => of([data])));
    }
  }
}
