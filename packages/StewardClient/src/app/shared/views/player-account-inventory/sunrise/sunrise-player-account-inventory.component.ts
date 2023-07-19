import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseService } from '@services/sunrise';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerAccountInventoryBaseComponent } from '../player-account-inventory.base.component';
import { SunrisePlayerAccountInventory } from '@models/sunrise/sunrise-player-account-inventory.model';

/** Retreives and displays a players' Sunrise account-inventory by XUID. */
@Component({
  selector: 'sunrise-player-account-inventory',
  templateUrl: '../player-account-inventory.component.html',
  styleUrls: ['../player-account-inventory.component.scss'],
})
export class SunrisePlayerAccountInventoryComponent extends PlayerAccountInventoryBaseComponent<SunrisePlayerAccountInventory> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets a player's account inventory by XUID. */
  public getPlayerAccountInventoryByXuid$(
    xuid: BigNumber,
  ): Observable<SunrisePlayerAccountInventory> {
    return this.sunrise.getPlayerAccountInventoryByXuid$(xuid);
  }
}
