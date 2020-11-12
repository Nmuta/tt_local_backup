import { Component } from '@angular/core';
import { PlayerDetailsBaseComponent } from '@components/player-details/player-details.base.component';
import { OpusPlayerDetails } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'opus-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
})
export class OpusPlayerDetailsComponent extends PlayerDetailsBaseComponent<
  OpusPlayerDetails
> {
  constructor(public readonly opusService: OpusService) {
    super();
  }

  /** Creates Opus's player details request. */
  public makeRequest$(): Observable<OpusPlayerDetails> {
    return this.opusService.getPlayerDetailsByGamertag(this.gamertag);
  }
}
