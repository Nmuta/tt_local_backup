import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';
import { OpusService } from '@services/opus';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Opus player inventory profiles component.
 */
@Component({
  selector: 'opus-player-inventory-profile-picker-composition',
  templateUrl: './opus-player-inventory-profile-picker.component.html',
})
export class OpusPlayerInventoryProfilePickerCompositionComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: OpusService) {
    this.service = {
      gameTitle: GameTitle.FH3,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }

  /** Handle profile change. */
  public onProfileChange(newProfile: ExtendedPlayerInventoryProfile): void {
    this.profileChange.emit(newProfile);
  }
}
