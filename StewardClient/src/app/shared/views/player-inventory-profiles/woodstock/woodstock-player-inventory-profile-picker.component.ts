import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockPlayerInventoryProfile } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { PlayerInventoryProfilesPickerBaseComponent } from '../player-inventory-profiles-picker/player-inventory-profiles-picker.base.component';

/** Displays a Woodstock player's inventory. */
@Component({
  selector: 'woodstock-player-inventory-profile-picker',
  templateUrl:
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.html',
  styleUrls: [
    '../player-inventory-profiles-picker/player-inventory-profiles-picker.component.scss',
  ],
})
export class WoodstockPlayerInventoryProfilePickerComponent extends PlayerInventoryProfilesPickerBaseComponent<
  IdentityResultAlpha,
  WoodstockPlayerInventoryProfile
> {
  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Implement in order to retrieve concrete identity instance. */
  protected getPlayerProfilesByIdentity$(
    identity: IdentityResultAlpha,
  ): Observable<WoodstockPlayerInventoryProfile[]> {
    return this.woodstock.getPlayerInventoryProfilesByXuid$(identity.xuid);
  }
}
