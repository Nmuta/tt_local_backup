import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusPlayerInventory } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import { PlayerInventoryBaseComponent, PropertyToExpandoData } from '../player-inventory.base.component';

/** Displays an Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory',
  templateUrl: './opus-player-inventory.component.html',
  styleUrls: ['./opus-player-inventory.component.scss']
})
export class OpusPlayerInventoryComponent
extends PlayerInventoryBaseComponent<
  OpusPlayerInventory,
  never,
  IdentityResultAlpha> {

  constructor(private readonly opus: OpusService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerInventoryByIdentity(identity: IdentityResultAlpha): Observable<OpusPlayerInventory> {
    return this.opus.getPlayerInventoryByXuid(identity.xuid);
  }

  /** Implement to specify the expando tables to show. */
  protected makeWhatToShow(): PropertyToExpandoData<OpusPlayerInventory>[] {
    return [
      this.makeEntry('cars', 'Cars'),
    ];
  }
}
