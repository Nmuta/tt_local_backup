import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
} from '@models/identity-query.model';
import { OpusService } from '@services/opus';
import { Observable } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Opus Player Selection */
@Component({
  selector: 'opus-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OpusPlayerSelectionComponent),
      multi: true,
    },
  ],
})
export class OpusPlayerSelectionComponent extends PlayerSelectionBaseComponent<
  IdentityResultAlpha
> {
  constructor(public readonly opusService: OpusService) {
    super();
  }

  /** Creates Opus's player selection request. */
  public makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<IdentityResultAlpha[]> {
    const identityQueries: IdentityQueryAlphaBatch = [];

    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      let query: IdentityQueryAlpha;

      if (playerIdType == 'gamertag') {
        query = { gamertag: playerId };
      } else if (playerIdType == 'xuid') {
        query = { xuid: BigInt(playerId) };
      }

      identityQueries[i] = query;
    }

    return this.opusService.getPlayerIdentities(identityQueries);
  }
}
