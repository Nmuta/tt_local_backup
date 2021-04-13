import { Component, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import BigNumber from 'bignumber.js';

/** A button that routes the user to an inventory app. */
@Component({
  selector: 'go-to-inventory-button',
  templateUrl: './go-to-inventory-button.component.html',
  styleUrls: ['./go-to-inventory-button.component.scss'],
})
export class GoToInventoryButtonComponent {
  @Input() public gameTitle: GameTitleCodeName = null;
  @Input() public xuid: BigNumber = null;

  /** Routes to the inventory app. */
  public goToInventory(): void {
    if (!!this.gameTitle && !!this.xuid) {
      const domain = environment.stewardUiUrl;
      const userDetailsLink = `${domain}/support/navbar-app/tools/user-details/${this.gameTitle.toLowerCase()}?lookupType=xuid&lookupName=${
        this.xuid
      }`;
      window.open(userDetailsLink, '_blank');
    }
  }
}
