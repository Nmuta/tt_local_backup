import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerInventoryProfile } from '@models/steelhead';
import { SteelheadService } from '@services/steelhead';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';

/** Displays a Steelhead player's inventory. */
@Component({
  selector: 'steelhead-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class SteelheadPlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  IdentityResultAlpha,
  SteelheadPlayerInventoryProfile
> {
  constructor(private readonly steelhead: SteelheadService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity(
    identity: IdentityResultAlpha,
  ): Observable<SteelheadPlayerInventoryProfile[]> {
    return this.steelhead.getPlayerInventoryProfilesByXuid(identity.xuid);
  }
}
