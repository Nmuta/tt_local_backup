import { Component } from '@angular/core';
import { ApolloService } from '@services/apollo';
import { Observable, of } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Apollo Player Selection */
@Component({
  selector: 'apollo-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
})
export class ApolloPlayerSelectionComponent extends PlayerSelectionBaseComponent<unknown> {
  constructor(public readonly apolloService: ApolloService) {
    super();
  }

  /** Creates Apollo's player selection request. */
  public makeRequestToValidateIds$(playerIds: string[], playerIdType: string): Observable<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const response: unknown[] = playerIds.map((x) => {
      const tmp = {};
      tmp[playerIdType] = x;
      return tmp;
    });
    return of(response);
  }
}
