import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseService } from '@services/sunrise';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerNotificationsBaseComponent } from '../player-notifications.base.component';
import { PlayerNotification } from '@models/notifications.model';

/** Retreives and displays a players' Sunrise notifications by XUID. */
@Component({
  selector: 'sunrise-player-notifications',
  templateUrl: '../player-notifications.component.html',
  styleUrls: ['../player-notifications.component.scss'],
})
export class SunrisePlayerNotificationsComponent extends PlayerNotificationsBaseComponent<PlayerNotification> {
  public gameTitle = GameTitle.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets a player's notification list by XUID. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<PlayerNotification[]> {
    return this.sunrise.getPlayerNotifications$(xuid);
  }
}
