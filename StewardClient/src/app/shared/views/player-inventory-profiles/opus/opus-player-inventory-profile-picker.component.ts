import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { OpusPlayerInventoryProfile } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';

/** Displays a Opus player's inventory. */
@Component({
  selector: 'opus-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class OpusPlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  IdentityResultAlpha,
  OpusPlayerInventoryProfile
> {
  constructor(private readonly opus: OpusService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<OpusPlayerInventoryProfile[]> {
    return this.opus.getPlayerInventoryProfilesByXuid$(identity.xuid);
  }
}
