import { Component } from '@angular/core';
import { PlayerDetailsBaseComponent } from '@components/player-details/player-details.base.component';
import { ApolloPlayerDetails } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'apollo-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
})
export class ApolloPlayerDetailsComponent extends PlayerDetailsBaseComponent<ApolloPlayerDetails> {
  constructor(public readonly apolloService: ApolloService) {
    super();
  }

  /** Creates Apollo's player details request. */
  public makeRequest$(): Observable<ApolloPlayerDetails> {
    return this.apolloService.getPlayerDetailsByGamertag(this.gamertag);
  }
}
