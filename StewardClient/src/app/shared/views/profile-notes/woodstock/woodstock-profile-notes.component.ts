import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { ProfileNotesServiceContract } from '../profile-notes.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockPlayerProfileNotesService } from '@services/api-v2/woodstock/player/profile-notes/woodstock-player-profile-notes.service';

/** Retreives and displays Woodstock user profile notes by XUID. */
@Component({
  selector: 'woodstock-profile-notes',
  templateUrl: './woodstock-profile-notes.component.html',
})
export class WoodstockProfileNotesComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: ProfileNotesServiceContract;

  constructor(woodstockPlayerProfileNotesService: WoodstockPlayerProfileNotesService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getProfileNotesByXuid$: xuid =>
        woodstockPlayerProfileNotesService.getProfileNotesByXuid$(xuid),
      addProfileNoteByXuid$: (xuid: BigNumber, profileNote: string) =>
        woodstockPlayerProfileNotesService.addProfileNoteByXuid$(xuid, profileNote),
    };
  }
}
