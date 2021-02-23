import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import {
  PlayerInventoryBaseComponent,
  PropertyToExpandoData,
} from '../player-inventory.base.component';

/** Displays an Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory',
  templateUrl: '../player-inventory.component.html',
  styleUrls: ['../player-inventory.component.scss'],
})
export class OpusPlayerInventoryComponent extends PlayerInventoryBaseComponent<
  OpusMasterInventory,
  IdentityResultAlpha
> {
  constructor(private readonly opus: OpusService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<OpusMasterInventory> {
    return this.opus.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<OpusMasterInventory>[] {
    return [this.makeEntry('creditRewards', 'Credit Rewards'), this.makeEntry('cars', 'Cars')];
  }
}
