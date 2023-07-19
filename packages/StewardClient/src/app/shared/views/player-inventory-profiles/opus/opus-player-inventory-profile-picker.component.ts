import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';
import { OpusService } from '@services/opus';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Opus player inventory profiles component.
 */
@Component({
  selector: 'opus-player-inventory-profile-picker',
  templateUrl: './opus-player-inventory-profile-picker.component.html',
})
export class OpusPlayerInventoryProfilePickerComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<PlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: OpusService) {
    this.service = {
      gameTitle: GameTitle.FH3,
      getPlayerInventoryProfiles$: xuid =>
        playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
