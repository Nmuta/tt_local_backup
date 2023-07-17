import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { PlayerUgcBaseComponent } from '../player-ugc.base.component';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import { SteelheadPlayerUgcService } from '@services/api-v2/steelhead/player/ugc/steelhead-player-ugc.service';

/** Retreives and displays Steelhead ugc by XUID. */
@Component({
  selector: 'steelhead-player-ugc',
  templateUrl: './steelhead-player-ugc.component.html',
  styleUrls: ['../player-ugc.component.scss'],
})
export class SteelheadPlayerUgcComponent extends PlayerUgcBaseComponent implements OnChanges {
  public gameTitle = GameTitle.FM8;

  constructor(
    private readonly steelheadPlayerUgcService: SteelheadPlayerUgcService,
    private readonly steelheadUgcLookupService: SteelheadUgcLookupService,
  ) {
    super();
  }

  /** Searches player UGC content. */
  public getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]> {
    return this.usingIdentities
      ? this.steelheadPlayerUgcService.getPlayerUgcByType$(this.identity?.xuid, contentType)
      : this.steelheadUgcLookupService.getUgcBySharecode$(this.shareCode, contentType);
  }
}
