import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloPlayerInventoryProfile } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';
import BigNumber from 'bignumber.js';

/** Displays a Apollo player's inventory. */
@Component({
  selector: 'apollo-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class ApolloPlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  BigNumber,
  IdentityResultAlpha,
  ApolloPlayerInventoryProfile
> {
  constructor(private readonly apollo: ApolloService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<ApolloPlayerInventoryProfile[]> {
    return this.apollo.getPlayerInventoryProfilesByXuid$(identity.xuid);
  }
}
