import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { ProfileNotesServiceContract } from '../profile-notes.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerProfileNotesService } from '@services/api-v2/steelhead/player/profile-notes/steelhead-player-profile-notes.service';

/** Retreives and displays Steelhead user profile notes by XUID. */
@Component({
  selector: 'steelhead-profile-notes',
  templateUrl: './steelhead-profile-notes.component.html',
})
export class SteelheadProfileNotesComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: ProfileNotesServiceContract;

  constructor(steelheadPlayerProfileNotesService: SteelheadPlayerProfileNotesService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getProfileNotesByXuid$: xuid =>
        steelheadPlayerProfileNotesService.getProfileNotesByXuid$(xuid),
      addProfileNoteByXuid$: (xuid: BigNumber, profileNote: string) =>
        steelheadPlayerProfileNotesService.addProfileNoteByXuid$(xuid, profileNote),
    };
  }
}
