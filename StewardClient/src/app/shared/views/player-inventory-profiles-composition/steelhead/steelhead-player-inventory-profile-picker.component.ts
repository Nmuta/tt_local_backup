import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Steelhead player inventory profiles component.
 */
@Component({
  selector: 'steelhead-player-inventory-profile-picker-composition',
  templateUrl: './steelhead-player-inventory-profile-picker.component.html',
})
export class SteelheadPlayerInventoryProfilePickerCompositionComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(private readonly playerInventoryService: SteelheadPlayerInventoryService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getInventoryProfilesByXuid$(xuid),
    };
  }
}
