import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';
import { ApolloService } from '@services/apollo';
import { PlayerInventoryProfilePickerServiceContract } from '../player-inventory-profile-picker.component';

/**
 *  Apollo player inventory profiles component.
 */
@Component({
  selector: 'apollo-player-inventory-profile-picker',
  templateUrl: './apollo-player-inventory-profile-picker.component.html',
})
export class ApolloPlayerInventoryProfilePickerComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<PlayerInventoryProfile>();
  public service: PlayerInventoryProfilePickerServiceContract;

  constructor(playerInventoryService: ApolloService) {
    this.service = {
      gameTitle: GameTitle.FM7,
      getPlayerInventoryProfiles$: xuid =>
        playerInventoryService.getPlayerInventoryProfilesByXuid$(xuid),
    };
  }
}
