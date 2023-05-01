import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { ExtendedPlayerInventoryProfile, PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Apollo player inventory profiles component.
 */
@Component({
  selector: 'apollo-player-inventory-profile-picker-composition',
  templateUrl: './apollo-player-inventory-profile-picker.component.html',
})
export class ApolloPlayerInventoryProfilePickerCompositionComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(private readonly playerInventoryService: ApolloService) {
    this.service = {
      gameTitle: GameTitle.FM7,
      getPlayerInventoryProfiles$: xuid => playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }

  /** Handle profile change. */
  public onProfileChange(newProfile: ExtendedPlayerInventoryProfile): void {
    this.profileChange.emit(newProfile);
  }
}
