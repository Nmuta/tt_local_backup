import { Component, Input } from '@angular/core';
import { PlayerDetailsComponentBase } from '@components/player-details/player-details.component';
import { OpusPlayerDetails } from '@models/opus';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'opus-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
  inputs: ['gamertag'],
  outputs: ['xuidFoundEvent'],
})
export class OpusPlayerDetailsComponent extends PlayerDetailsComponentBase<
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
