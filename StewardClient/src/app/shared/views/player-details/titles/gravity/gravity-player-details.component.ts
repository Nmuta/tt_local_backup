import { Component } from '@angular/core';
import { GravityPlayerDetails } from '@models/gravity';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerDetailsBaseComponent } from '../../player-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'gravity-player-details',
  templateUrl: '../../player-details.component.html',
  styleUrls: ['../../player-details.component.scss'],
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
