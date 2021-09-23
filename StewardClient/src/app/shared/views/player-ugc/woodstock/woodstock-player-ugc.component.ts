import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerUGCBaseComponent } from '../player-ugc.base.component';
import { WoodstockService } from '@services/woodstock';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCType } from '@models/ugc-filters';

/** Retreives and displays Woodstock ugc by XUID. */
@Component({
  selector: 'woodstock-player-ugc',
  templateUrl: './woodstock-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class WoodstockPlayerUGCComponent extends PlayerUGCBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUGC$(contentType: UGCType): Observable<PlayerUGCItem[]> {
    return this.usingIdentities
      ? this.woodstockService.getPlayerUGCByXuid$(this.identity?.xuid, contentType)
      : this.woodstockService.getPlayerUGCByShareCode$(this.shareCode, contentType);
  }
}
