import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadPlayerUgcService } from '@services/api-v2/steelhead/player/ugc/steelhead-player-ugc.service';
import { SteelheadUgcVisibilityService } from '@services/api-v2/steelhead/ugc/visibility/steelhead-ugc-visibility.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { HiddenUgcServiceContract } from '../hidden-ugc-table/hidden-ugc-table.component';

/** Retrieves and renders a player's steelhead hidden UGC. */
@Component({
  selector: 'steelhead-player-hidden-ugc',
  templateUrl: './steelhead-player-hidden-ugc.component.html',
  styleUrls: ['./steelhead-player-hidden-ugc.component.scss'],
})
export class SteelheadPlayerHiddenUgcComponent {
  /** Player identity. */
  @Input() public identity: IdentityResultAlpha;
  public getMonitor: ActionMonitor;
  public serviceContract: HiddenUgcServiceContract;

  constructor(
    ugcVisibilityService: SteelheadUgcVisibilityService,
    playerUgcService: SteelheadPlayerUgcService,
  ) {
    this.serviceContract = {
      title: GameTitle.FH5,
      getPlayerHiddenUgcByXuid$: xuid => playerUgcService.getPlayerHiddenUgc$(xuid),
      unhideUgc$: (_xuid, _fileType, ugcId) => ugcVisibilityService.unhideUgcItem$(ugcId),
    };
  }

  /** Retrieve child monitor for use with reload spinner in User Details tab. */
  public prepareMonitor(childMonitor: ActionMonitor) {
    this.getMonitor = childMonitor;
  }
}
