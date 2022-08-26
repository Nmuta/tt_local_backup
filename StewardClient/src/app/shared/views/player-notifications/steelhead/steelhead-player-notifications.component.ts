import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { PlayerNotificationsBaseComponent } from '../player-notifications.base.component';
import { Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { PlayerNotification } from '@models/notifications.model';
import { SteelheadPlayerMessagesService } from '@services/api-v2/steelhead/player/messages/steelhead-player-messages.service';

/** Retreives and displays a players' Steelhead notifications by XUID. */
@Component({
  selector: 'steelhead-player-notifications',
  templateUrl: '../player-notifications.component.html',
  styleUrls: ['../player-notifications.component.scss'],
})
export class SteelheadPlayerNotificationsComponent extends PlayerNotificationsBaseComponent<PlayerNotification> {
  public gameTitle = GameTitle.FM8;

  constructor(private readonly steelheadPlayerMessagesService: SteelheadPlayerMessagesService) {
    super();
  }

  /** Gets a player's notification list by XUID. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<PlayerNotification[]> {
    return this.steelheadPlayerMessagesService.getPlayerNotifications$(xuid);
  }
}
