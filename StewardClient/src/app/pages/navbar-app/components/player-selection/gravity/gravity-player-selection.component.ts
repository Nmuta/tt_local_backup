import { Component } from '@angular/core';
import { GravityService } from '@services/gravity';
import { Observable, of } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Gravity Player Selection */
@Component({
  selector: 'gravity-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
})
export class GravityPlayerSelectionComponent extends PlayerSelectionBaseComponent<unknown> {
  constructor(public readonly gravityService: GravityService) {
    super();
  }

  /** Creates Sunrise's player selection request. */
  public makeRequestToValidateIds$(
    playerIds: string[],
    playerIdType: string,
  ): Observable<unknown[]> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const response: unknown[] = playerIds.map(x => {
      const tmp = {};
      tmp[playerIdType] = x;
      tmp['error'] = Math.random() < 0.5;
      return tmp;
    });
    return of(response);
  }
}
