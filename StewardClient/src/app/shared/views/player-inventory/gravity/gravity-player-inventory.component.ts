import { Component } from '@angular/core';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityInventoryItem } from '@models/gravity/inventory-items';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent, PropertyToExpandoData } from '../player-inventory.base.component';

/** Displays a Gravity player's inventory. */
@Component({
  selector: 'gravity-player-inventory',
  templateUrl: './gravity-player-inventory.component.html',
  styleUrls: ['./gravity-player-inventory.component.scss']
})
export class GravityPlayerInventoryComponent
extends PlayerInventoryBaseComponent<
  GravityPlayerInventory,
  GravityInventoryItem,
  IdentityResultBeta> {

  constructor(private readonly gravity: GravityService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(identity: IdentityResultBeta): Observable<GravityPlayerInventory> {
    return this.gravity.getPlayerInventoryByT10Id(identity.t10Id);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<GravityPlayerInventory>[] {
    return [
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('masteryKits', 'Mastery Kits'),
      this.makeEntry('packs', 'Packs'),
      this.makeEntry('currencies', 'Currencies'),
      this.makeEntry('energyRefills', 'Energy Refills'),
    ];
  }
}
