import { Component } from '@angular/core';
import { OpusService } from '@services/opus';
import { Observable, of } from 'rxjs';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** Opus Player Selection */
@Component({
  selector: 'opus-player-selection',
  templateUrl: '../player-selection.component.html',
  styleUrls: ['../player-selection.component.scss'],
})
export class OpusPlayerSelectionComponent extends PlayerSelectionBaseComponent<unknown> {
  constructor(public readonly opusService: OpusService) {
    super();
  }

  /** Creates Opus's player selection request. */
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
