import { Component, Input } from '@angular/core';
import { PlayerDetailsBaseComponent } from '@components/player-details/player-details.base.component';
import { GravityPlayerDetails } from '@models/gravity';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'gravity-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
})
export class GravityPlayerDetailsComponent extends PlayerDetailsBaseComponent<
  GravityPlayerDetails
> {
  constructor(public readonly gravityService: GravityService) {
    super();
  }

  /** Creates Gravity's player details request. */
  public makeRequest$(): Observable<GravityPlayerDetails> {
    return this.gravityService.getPlayerDetailsByGamertag(this.gamertag);
  }
}
