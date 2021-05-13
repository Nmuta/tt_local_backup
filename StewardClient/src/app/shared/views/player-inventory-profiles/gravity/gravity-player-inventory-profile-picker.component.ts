import { Component } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityPseudoPlayerInventoryProfile } from '@models/gravity';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';

/** Displays a Gravity player's inventory. */
@Component({
  selector: 'gravity-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class GravityPlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  string,
  IdentityResultBeta,
  GravityPseudoPlayerInventoryProfile
> {
  constructor(private readonly gravity: GravityService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity$(
    identity: IdentityResultBeta,
  ): Observable<GravityPseudoPlayerInventoryProfile[]> {
    return this.gravity.getPlayerInventoryProfilesByT10Id$(identity.t10Id);
  }
}
