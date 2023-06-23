import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockPlayerUgcService } from '@services/api-v2/woodstock/player/ugc/woodstock-player-ugc.service';
import { WoodstockUgcVisibilityService } from '@services/api-v2/woodstock/ugc/visibility/woodstock-ugc-visibility.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { HiddenUgcServiceContract } from '../hidden-ugc-table/hidden-ugc-table.component';

/** Retrieves and renders a player's woodstock hidden UGC. */
@Component({
  selector: 'woodstock-player-hidden-ugc',
  templateUrl: './woodstock-player-hidden-ugc.component.html',
  styleUrls: ['./woodstock-player-hidden-ugc.component.scss'],
})
export class WoodstockPlayerHiddenUgcComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  public getMonitor: ActionMonitor;
  public gameTitle = GameTitle.FH5;

  public serviceContract: HiddenUgcServiceContract;

  constructor(playerUgcService: WoodstockPlayerUgcService, visibilityService: WoodstockUgcVisibilityService) {
    this.serviceContract = {
      unhideUgc$: (_xuid, _fileType, ugcId) => visibilityService.unhideUgc$(ugcId),
      getPlayerHiddenUgcByXuid$: (xuid) => playerUgcService.getPlayerHiddenUgcByXuid$(xuid),
    }
  }

  /** Retrieve child monitor for use with reload spinner in User Details tab. */
  public prepareMonitor(childMonitor: ActionMonitor) {
    this.getMonitor = childMonitor;
  }
}