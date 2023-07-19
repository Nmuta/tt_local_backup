import { Injectable } from '@angular/core';
import { ProfileNote } from '@models/profile-note.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/sunrise/player/{xuid}/profileNotes endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SunrisePlayerProfileNotesService {
  public readonly basePath: string = 'title/sunrise/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player profile notes. */
  public getProfileNotesByXuid$(xuid: BigNumber): Observable<ProfileNote[]> {
    return this.api.getRequest$<ProfileNote[]>(`${this.basePath}/${xuid}/profileNotes`);
  }

  /** Add a profile note to the player by xuid. */
  public addProfileNoteByXuid$(xuid: BigNumber, profileNote: string): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${xuid}/profileNotes`, profileNote);
  }
}
