import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { OpusPlayerDetails } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'opus-player-sidebar-details',
  templateUrl: '../player-sidebar-details.component.html',
  styleUrls: ['../player-sidebar-details.component.scss'],
})
export class OpusPlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<
  OpusPlayerDetails
> {
  public gameTitle = GameTitleCodeName.FH3;

  constructor(private readonly opusService: OpusService) {
    super();
  }

  /** Creates Opus's player details request. */
  public makeRequest$(): Observable<OpusPlayerDetails> {
    return this.opusService.getPlayerDetailsByGamertag$(this.gamertag);
  }
}
