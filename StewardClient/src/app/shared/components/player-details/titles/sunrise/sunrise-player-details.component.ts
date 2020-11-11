import { Component, Input } from '@angular/core';
import { PlayerDetailsBaseComponent } from '@components/player-details/player-details.base.component';
import { SunrisePlayerDetails } from '@models/sunrise';
import { GravityService } from '@services/gravity';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'sunrise-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
})
export class SunrisePlayerDetailsComponent extends PlayerDetailsBaseComponent<
  SunrisePlayerDetails
> {
  constructor(public readonly sunriseService: SunriseService) {
    super();
  }

  /** Creates Sunrise's player details request. */
  public makeRequest$(): Observable<SunrisePlayerDetails> {
    return this.sunriseService.getPlayerDetailsByGamertag(this.gamertag);
  }
}
