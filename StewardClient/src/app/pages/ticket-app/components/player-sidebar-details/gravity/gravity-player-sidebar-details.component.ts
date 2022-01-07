import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerDetails } from '@models/gravity';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'gravity-player-sidebar-details',
  templateUrl: '../player-sidebar-details.component.html',
  styleUrls: ['../player-sidebar-details.component.scss'],
})
export class GravityPlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<GravityPlayerDetails> {
  public gameTitle = GameTitleCodeName.Street;

  constructor(private readonly gravityService: GravityService) {
    super();
  }

  /** Creates Gravity's player details request. */
  public makeRequest$(): Observable<GravityPlayerDetails> {
    return this.gravityService.getPlayerDetailsByGamertag$(this.gamertag);
  }
}
