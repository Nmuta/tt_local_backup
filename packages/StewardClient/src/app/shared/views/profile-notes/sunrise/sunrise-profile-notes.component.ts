import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { ProfileNotesServiceContract } from '../profile-notes.component';
import { SunrisePlayerProfileNotesService } from '@services/api-v2/sunrise/player/profile-notes/sunrise-player-profile-notes.service';
import { IdentityResultAlpha } from '@models/identity-query.model';

/** Retreives and displays Sunrise user profile notes by XUID. */
@Component({
  selector: 'sunrise-profile-notes',
  templateUrl: './sunrise-profile-notes.component.html',
})
export class SunriseProfileNotesComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: ProfileNotesServiceContract;

  constructor(sunrisePlayerProfileNotesService: SunrisePlayerProfileNotesService) {
    this.service = {
      gameTitle: GameTitle.FH4,
      getProfileNotesByXuid$: xuid => sunrisePlayerProfileNotesService.getProfileNotesByXuid$(xuid),
      addProfileNoteByXuid$: (xuid: BigNumber, profileNote: string) =>
        sunrisePlayerProfileNotesService.addProfileNoteByXuid$(xuid, profileNote),
    };
  }
}
