import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise';
import { Observable, of } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Gravity Player Selection */
@Component({
  selector: 'sunrise-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SunrisePlayerSelectionComponent),
      multi: true
    },
  ],
})
export class SunrisePlayerSelectionComponent extends PlayerSelectionBaseComponent<
  IdentityResultAlpha
> {
  constructor(public readonly sunriseService: SunriseService) {
    super();
  }

  /** Creates Sunrise's player selection request. */
  public makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<IdentityResultAlpha[]> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const response: IdentityResultAlpha[] = playerIds.map(x => {
      const tmp: IdentityResultAlpha = {
        query: undefined,
        xuid: BigInt(789639236092375),
        gamertag: `${playerIdType}:${x}`,
        error: undefined,
      };
      return tmp;
    });
    return of(response);
  }
}
