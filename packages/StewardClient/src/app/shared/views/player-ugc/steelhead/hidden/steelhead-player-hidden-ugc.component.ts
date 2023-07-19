import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerUgcBaseComponent } from '../../player-ugc.base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { SteelheadPlayerUgcService } from '@services/api-v2/steelhead/player/ugc/steelhead-player-ugc.service';

/** Retreives and displays Steelhead ugc by XUID. */
@Component({
  selector: 'steelhead-player-hidden-ugc',
  templateUrl: './steelhead-player-hidden-ugc.component.html',
  styleUrls: ['../../player-ugc.component.scss'],
})
export class SteelheadPlayerHiddenUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM8;

  constructor(private readonly service: SteelheadPlayerUgcService) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    if (!this.usingIdentities) {
      throw new Error(`${GameTitle.FM8} Player Hidden UGC does not support Sharecode lookup.`);
    }

    return this.service.getPlayerHiddenUgcByType$(this.identity.xuid, contentType);
  }
}
