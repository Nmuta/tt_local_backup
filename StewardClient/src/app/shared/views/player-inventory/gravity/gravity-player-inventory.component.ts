import { Component } from '@angular/core';
import { GravityPlayerInventoryBeta } from '@models/gravity';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import {
  PlayerInventoryBaseComponent,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

/** Displays a Gravity player's inventory. */
@Component({
  selector: 'gravity-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class GravityPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  GravityPlayerInventoryBeta,
  IdentityResultBeta
> {
  constructor(private readonly gravity: GravityService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultBeta,
  ): Observable<GravityPlayerInventoryBeta> {
    return this.gravity.getPlayerInventoryByT10Id(identity.t10Id);
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentityAndProfileId(
    identity: IdentityResultBeta,
    profileId: bigint,
  ): Observable<GravityPlayerInventory> {
    return this.gravity.getPlayerInventoryByT10IdAndProfileId(identity.t10Id, profileId);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<GravityPlayerInventoryBeta>[] {
    return [
      this.makeEntry('creditRewards', 'Credit Rewards'),
      this.makeEntry('cars', 'Cars'),
      this.makeEntry('masteryKits', 'Mastery Kits'),
      this.makeEntry('energyRefills', 'Energy Refills'),
    ];
  }
}
