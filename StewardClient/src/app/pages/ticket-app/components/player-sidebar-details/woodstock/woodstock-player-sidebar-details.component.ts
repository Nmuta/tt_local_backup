import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { WoodstockPlayerDetails } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'woodstock-player-sidebar-details',
  templateUrl: '../player-sidebar-details.component.html',
  styleUrls: ['../player-sidebar-details.component.scss'],
})
export class WoodstockPlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<WoodstockPlayerDetails> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Creates Woodstock's player details request. */
  public makeRequest$(): Observable<WoodstockPlayerDetails> {
    return this.woodstockService.getPlayerDetailsByGamertag$(this.gamertag);
  }
}
