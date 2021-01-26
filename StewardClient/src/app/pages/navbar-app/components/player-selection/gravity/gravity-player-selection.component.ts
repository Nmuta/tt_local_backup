import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitleCodeName } from '@models/enums';
import {
  IdentityQueryBeta,
  IdentityQueryBetaBatch,
  IdentityResultBeta,
} from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Gravity Player Selection */
@Component({
  selector: 'gravity-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GravityPlayerSelectionComponent),
      multi: true,
    },
  ],
})
export class GravityPlayerSelectionComponent extends PlayerSelectionBaseComponent<
  IdentityResultBeta
> {
  public title = GameTitleCodeName.Street;

  constructor(public readonly gravityService: GravityService) {
    super();
  }

  /** Creates Sunrise's player selection request. */
  public makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<IdentityResultBeta[]> {
    const identityQueries: IdentityQueryBetaBatch = [];

    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      let query: IdentityQueryBeta;

      if (playerIdType == 'gamertag') {
        query = { gamertag: playerId };
      } else if (playerIdType == 'xuid') {
        query = { xuid: BigInt(playerId) };
      } else if (playerIdType == 't10Id') {
        query = { t10Id: playerId };
      }

      identityQueries[i] = query;
    }

    return this.gravityService.getPlayerIdentities(identityQueries);
  }
}
