import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { ProfileNotesBaseComponent } from '../profile-notes.base.component';
import { ProfileNote } from '@models/profile-note.model';

/** Retreives and displays Woodstock user profile notes by XUID. */
@Component({
  selector: 'woodstock-profile-notes',
  templateUrl: '../profile-notes.component.html',
  styleUrls: ['../profile-notes.component.scss'],
})
export class WoodstockProfileNotesComponent extends ProfileNotesBaseComponent {
  public gameTitle = GameTitle.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Gets Woodstock user flags. */
  public getProfileNotesXuid$(xuid: BigNumber): Observable<ProfileNote[]> {
    return this.woodstockService.getProfileNotesXuid$(xuid);
  }
}
