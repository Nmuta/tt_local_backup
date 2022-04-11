import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerUgcBaseComponent } from '../player-ugc.base.component';
import { WoodstockService } from '@services/woodstock';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';

/** Retreives and displays Woodstock ugc by XUID. */
@Component({
  selector: 'woodstock-player-ugc',
  templateUrl: './woodstock-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class WoodstockPlayerUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    return this.usingIdentities
      ? this.woodstockService.getPlayerUgcByXuid$(this.identity?.xuid, contentType)
      : this.woodstockService.getPlayerUgcByShareCode$(this.shareCode, contentType);
  }
}
