import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { HiddenUgcServiceContract } from '../hidden-ugc-table/hidden-ugc-table.component';

/** Retrieves and renders a player's sunrise hidden UGC. */
@Component({
  selector: 'sunrise-player-hidden-ugc',
  templateUrl: './sunrise-player-hidden-ugc.component.html',
  styleUrls: ['./sunrise-player-hidden-ugc.component.scss'],
})
export class SunrisePlayerHiddenUgcComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  public getMonitor: ActionMonitor;
  public serviceContract: HiddenUgcServiceContract;

  constructor(public readonly service: SunriseService) {
    this.serviceContract = {
      title: GameTitle.FH5,
      getPlayerHiddenUgcByXuid$: xuid => service.getPlayerHiddenUgcByXuid$(xuid),
      unhideUgc$: (xuid, fileType, ugcId) => service.unhideUgc$(xuid, fileType, ugcId),
    };
  }

  /** Retrieve child monitor for use with reload spinner in User Details tab. */
  public prepareMonitor(childMonitor: ActionMonitor) {
    this.getMonitor = childMonitor;
  }
}
