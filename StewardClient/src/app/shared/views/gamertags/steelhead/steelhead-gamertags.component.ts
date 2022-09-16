import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { SteelheadSharedConsoleUser } from '@models/steelhead';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { ActivatedRoute } from '@angular/router';
import { SteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service';

/** Retreives and displays related Steelhead accounts by XUID. */
@Component({
  selector: 'steelhead-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class SteelheadGamertagsComponent extends GamertagsBaseComponent<SteelheadSharedConsoleUser> {
  public gameTitle = GameTitleCodeName.FM8;

  constructor(
    private readonly steelheadPlayerConsoleService: SteelheadPlayerConsolesService,
    route: ActivatedRoute,
  ) {
    super(route);
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<SteelheadSharedConsoleUser[]> {
    return this.steelheadPlayerConsoleService.getSharedConsoleUsersByXuid$(xuid);
  }
}
