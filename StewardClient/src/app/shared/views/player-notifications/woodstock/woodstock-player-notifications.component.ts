import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockPlayerNotification } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { PlayerNotificationsBaseComponent } from '../player-notifications.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays a players' Woodstock notifications by XUID. */
@Component({
  selector: 'woodstock-player-notifications',
  templateUrl: '../player-notifications.component.html',
  styleUrls: ['../player-notifications.component.scss'],
})
export class WoodstockPlayerNotificationsComponent extends PlayerNotificationsBaseComponent<
  WoodstockPlayerNotification
> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Gets a player's notification list by XUID. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<WoodstockPlayerNotification[]> {
    return this.woodstock.getPlayerNotificationsByXuid$(xuid);
  }
}
