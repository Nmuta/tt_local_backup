import { Component, Input } from '@angular/core';
import { PlayerDetailsComponentBase } from '@components/player-details/player-details.component';
import { ApolloPlayerDetails } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';

/** Gravity Player Details */
@Component({
  selector: 'apollo-player-details',
  templateUrl: '../../player-details.html',
  styleUrls: ['../../player-details.scss'],
  inputs: ['gamertag'],
  outputs: ['xuidFoundEvent'],
})
export class ApolloPlayerDetailsComponent extends PlayerDetailsComponentBase<
  ApolloPlayerDetails
> {
  constructor(public readonly apolloService: ApolloService) {
    super();
  }

  /** Creates Apollo's player details request. */
  public makeRequest$(): Observable<ApolloPlayerDetails> {
    return this.apolloService.getPlayerDetailsByGamertag(this.gamertag);
  }
}
