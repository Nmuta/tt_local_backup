import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';
import { WoodstockService } from '@services/woodstock';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Woodstock player inventory profiles component.
 */
@Component({
  selector: 'woodstock-player-inventory-profile-picker',
  templateUrl: './woodstock-player-inventory-profile-picker.component.html',
})
export class WoodstockPlayerInventoryProfilePickerComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: WoodstockService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayerInventoryProfiles$: xuid =>
        playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
