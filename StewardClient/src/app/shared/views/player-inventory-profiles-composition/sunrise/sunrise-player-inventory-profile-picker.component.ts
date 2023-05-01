import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SunriseService } from '@services/sunrise';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Sunrise player inventory profiles component.
 */
@Component({
  selector: 'sunrise-player-inventory-profile-picker-composition',
  templateUrl: './sunrise-player-inventory-profile-picker.component.html',
})
export class SunrisePlayerInventoryProfilePickerCompositionComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: SunriseService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }

  /** Handle profile change. */
  public onProfileChange(newProfile: ExtendedPlayerInventoryProfile): void {
    this.profileChange.emit(newProfile);
  }
}
