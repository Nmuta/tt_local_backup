import { Component, Input } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { ZendeskService } from '@services/zendesk';

/** A button that routes the user to an inventory app. */
@Component({
  selector: 'go-to-inventory-button',
  templateUrl: './go-to-inventory-button.component.html',
  styleUrls: ['./go-to-inventory-button.component.scss']
})
export class GoToInventoryButtonComponent {
  @Input() public gameTitle: GameTitleCodeName = null;
  @Input() public xuid: BigInt = null;

  constructor(
    private readonly zendesk: ZendeskService,
  ) { }

  /** Routes to the inventory app. */
  public goToInventory(): void {
    if (!!this.gameTitle && !!this.xuid) {
      const appSection = this.gameTitle + '/' + this.xuid;
      this.zendesk.goToApp$('nav_bar', 'forza-inventory-support', appSection).subscribe();
    }
  }
}
