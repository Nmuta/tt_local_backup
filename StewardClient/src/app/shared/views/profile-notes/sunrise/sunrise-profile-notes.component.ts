import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { ProfileNotesBaseComponent } from '../profile-notes.base.component';
import { ProfileNote } from '@models/profile-note.model';

/** Retreives and displays Sunrise user profile notes by XUID. */
@Component({
  selector: 'sunrise-profile-notes',
  templateUrl: '../profile-notes.component.html',
  styleUrls: ['../profile-notes.component.scss'],
})
export class SunriseProfileNotesComponent extends ProfileNotesBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets Sunrise user flags. */
  public getProfileNotesXuid$(xuid: BigNumber): Observable<ProfileNote[]> {
    return this.sunriseService.getProfileNotesXuid$(xuid);
  }
}
