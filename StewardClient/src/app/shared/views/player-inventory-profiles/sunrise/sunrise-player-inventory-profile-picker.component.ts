import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunrisePlayerInventoryProfile } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';

/** Displays a Sunrise player's inventory. */
@Component({
  selector: 'sunrise-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class SunrisePlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  BigNumber,
  IdentityResultAlpha,
  SunrisePlayerInventoryProfile
> {
  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<SunrisePlayerInventoryProfile[]> {
    return this.sunrise.getPlayerInventoryProfilesByXuid$(identity.xuid);
  }
}
