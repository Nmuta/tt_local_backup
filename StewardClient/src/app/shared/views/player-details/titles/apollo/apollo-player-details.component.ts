import { Component } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { PlayerDetailsBaseComponent } from '../../player-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'apollo-player-details',
  templateUrl: '../../player-details.component.html',
  styleUrls: ['../../player-details.component.scss'],
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
