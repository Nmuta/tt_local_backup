import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerUgcBaseComponent } from '../../player-ugc.base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { WoodstockPlayerUgcService } from '@services/api-v2/woodstock/player/ugc/woodstock-player-ugc.service';

/** Retreives and displays Woodstock ugc by XUID. */
@Component({
  selector: 'woodstock-player-hidden-ugc',
  templateUrl: './woodstock-player-hidden-ugc.component.html',
  styleUrls: ['../../player-ugc.component.scss'],
})
export class WoodstockPlayerHiddenUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FH5;

  constructor(private readonly service: WoodstockPlayerUgcService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    if (!this.usingIdentities) {
      throw new Error(`${GameTitle.FH5} Player Hidden UGC does not support Sharecode lookup.`);
    }

    return this.service.getPlayerHiddenUgcByType$(this.identity.xuid, contentType);
  }
}
