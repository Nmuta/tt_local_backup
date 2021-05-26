import { Component } from '@angular/core';
import { ApolloPlayerDetails } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { PlayerSidebarDetailsBaseComponent } from '../player-sidebar-details.base.component';

/** Gravity Player Details */
@Component({
  selector: 'apollo-player-sidebar-details',
  templateUrl: '../player-sidebar-details.component.html',
  styleUrls: ['../player-sidebar-details.component.scss'],
})
export class ApolloPlayerSidebarDetailsComponent extends PlayerSidebarDetailsBaseComponent<
  ApolloPlayerDetails
> {
  public gameTitle = GameTitleCodeName.FM7;

  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Creates Apollo's player details request. */
  public makeRequest$(): Observable<ApolloPlayerDetails> {
    return this.apolloService.getPlayerDetailsByGamertag$(this.gamertag);
  }
}
