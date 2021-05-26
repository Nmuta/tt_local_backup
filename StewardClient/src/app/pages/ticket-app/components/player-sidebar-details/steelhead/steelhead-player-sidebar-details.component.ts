import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { SteelheadPlayerDetails } from '@models/steelhead';
import { SteelheadService } from '@services/steelhead';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'steelhead-player-sidebar-details',
  templateUrl: '../player-sidebar-details.component.html',
  styleUrls: ['../player-sidebar-details.component.scss'],
})
export class SteelheadPlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<
  SteelheadPlayerDetails
> {
  public gameTitle = GameTitleCodeName.FM8;

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Creates Steelhead's player details request. */
  public makeRequest$(): Observable<SteelheadPlayerDetails> {
    return this.steelheadService.getPlayerDetailsByGamertag$(this.gamertag);
  }
}
