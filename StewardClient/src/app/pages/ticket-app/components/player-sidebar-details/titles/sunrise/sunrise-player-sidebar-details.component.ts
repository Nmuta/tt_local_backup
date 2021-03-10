import { Component } from '@angular/core';
import { SunrisePlayerDetails } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'sunrise-player-sidebar-details',
  templateUrl: '../../player-sidebar-details.component.html',
  styleUrls: ['../../player-sidebar-details.component.scss'],
})
export class SunrisePlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<
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
