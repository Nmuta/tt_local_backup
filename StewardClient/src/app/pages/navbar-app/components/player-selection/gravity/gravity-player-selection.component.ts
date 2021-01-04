import { Component } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable, of } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Gravity Player Selection */
@Component({
  selector: 'gravity-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
})
export class GravityPlayerSelectionComponent extends PlayerSelectionBaseComponent<
  IdentityResultBeta
> {
  constructor(public readonly gravityService: GravityService) {
    super();
  }

  /** Creates Sunrise's player selection request. */
  public makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<IdentityResultBeta[]> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const response: IdentityResultBeta[] = playerIds.map(x => {
      const tmp: IdentityResultBeta = {
        query: undefined,
        xuid: BigInt(789639236092375),
        gamertag: `${playerIdType}:${x}`,
        t10id: `${playerIdType}:${x}`,
        error: undefined,
      };
      return tmp;
    });
    return of(response);
  }
}
