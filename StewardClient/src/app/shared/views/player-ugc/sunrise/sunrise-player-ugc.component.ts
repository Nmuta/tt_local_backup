import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { PlayerUgcBaseComponent } from '../player-ugc.base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';

/** Retreives and displays Sunrise ugc by XUID. */
@Component({
  selector: 'sunrise-player-ugc',
  templateUrl: './sunrise-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class SunrisePlayerUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseSerice: SunriseService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    return this.usingIdentities
      ? this.sunriseSerice.getPlayerUgcByXuid$(this.identity?.xuid, contentType)
      : this.sunriseSerice.getPlayerUgcByShareCode$(this.shareCode, contentType);
  }
}
