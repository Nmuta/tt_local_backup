import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusService } from '@services/opus';
import { ExtendedPlayerInventoryProfile, PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

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
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(private readonly playerInventoryService: OpusService) {
    this.service = {
      gameTitle: GameTitle.FH3,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
