import { Component } from '@angular/core';
import { SunrisePlayerDetails } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { PlayerDetailsBaseComponent } from '../../player-details.base.component';

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
