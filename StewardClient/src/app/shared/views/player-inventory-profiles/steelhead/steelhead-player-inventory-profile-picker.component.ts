import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Steelhead player inventory profiles component.
 */
@Component({
  selector: 'steelhead-player-inventory-profile-picker',
  templateUrl: './steelhead-player-inventory-profile-picker.component.html',
})
export class SteelheadPlayerInventoryProfilePickerComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: SteelheadPlayerInventoryService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getInventoryProfilesByXuid$(xuid),
    };
  }
}
