import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { ApolloService } from '@services/apollo/apollo.service';
import { Observable, throwError } from 'rxjs';
import { PlayerUgcBaseComponent } from '../player-ugc.base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';

/** Retreives and displays Apollo ugc by XUID. */
@Component({
  selector: 'apollo-player-ugc',
  templateUrl: './apollo-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class ApolloPlayerUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM7;

  constructor(private readonly apolloSerice: ApolloService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    return this.usingIdentities
      ? this.apolloSerice.getPlayerUgcByXuid$(this.identity?.xuid, contentType)
      : throwError('Apollo does not support searching UGC by sharecode');
  }
}
