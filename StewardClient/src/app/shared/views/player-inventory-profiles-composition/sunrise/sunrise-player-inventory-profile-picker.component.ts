import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise';
import { ExtendedPlayerInventoryProfile, PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

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
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(private readonly playerInventoryService: SunriseService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
