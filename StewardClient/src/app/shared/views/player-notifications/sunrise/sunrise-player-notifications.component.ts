import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunrisePlayerNotification } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerNotificationsBaseComponent } from '../player-notifications.base.component';

/** Retreives and displays a players' Sunrise notifications by XUID. */
@Component({
  selector: 'sunrise-player-notifications',
  templateUrl: '../player-notifications.component.html',
  styleUrls: ['../player-notifications.component.scss'],
})
export class SunrisePlayerNotificationsComponent extends PlayerNotificationsBaseComponent<
  SunrisePlayerNotification
> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets a player's notification list by XUID. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<SunrisePlayerNotification[]> {
    return this.sunrise.getPlayerNotificationsByXuid$(xuid);
  }
}
