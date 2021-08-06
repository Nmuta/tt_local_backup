import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { PlayerUGCBaseComponent } from '../player-ugc.base.component';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFilters } from '@models/ugc-filters';

/** Retreives and displays Sunrise ugc by XUID. */
@Component({
  selector: 'sunrise-player-ugc',
  templateUrl: './sunrise-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class SunrisePlayerUGCComponent extends PlayerUGCBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseSerice: SunriseService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUGC$(filters: UGCFilters): Observable<PlayerUGCItem[]> {
    return this.usingIdentities
      ? this.sunriseSerice.getPlayerUGCByXuid$(this.identity?.xuid, filters)
      : this.sunriseSerice.getPlayerUGCByShareCode$(this.shareCode, filters);
  }
}
