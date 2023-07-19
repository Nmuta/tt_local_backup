import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockService } from '@services/woodstock';
import { PlayerAccountInventoryBaseComponent } from '../player-account-inventory.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { WoodstockPlayerAccountInventory } from '@models/woodstock/woodstock-player-account-inventory.model';

/** Retreives and displays a players' Woodstock account-inventory by XUID. */
@Component({
  selector: 'woodstock-player-account-inventory',
  templateUrl: '../player-account-inventory.component.html',
  styleUrls: ['../player-account-inventory.component.scss'],
})
export class WoodstockPlayerAccountInventoryComponent extends PlayerAccountInventoryBaseComponent<WoodstockPlayerAccountInventory> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Gets a player's account inventory by XUID. */
  public getPlayerAccountInventoryByXuid$(
    xuid: BigNumber,
  ): Observable<WoodstockPlayerAccountInventory> {
    return this.woodstock.getPlayerAccountInventoryByXuid$(xuid);
  }
}
