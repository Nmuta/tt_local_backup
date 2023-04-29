import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockService } from '@services/woodstock';
import { ExtendedPlayerInventoryProfile, PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Woodstock player inventory profiles component.
 */
@Component({
  selector: 'woodstock-player-inventory-profile-picker-composition',
  templateUrl: './woodstock-player-inventory-profile-picker.component.html',
})
export class WoodstockPlayerInventoryProfilePickerCompositionComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(private readonly playerInventoryService: WoodstockService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
