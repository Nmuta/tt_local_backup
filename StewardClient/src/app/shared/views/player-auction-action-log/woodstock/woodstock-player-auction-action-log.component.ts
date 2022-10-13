import { Component, Input, ViewChild } from '@angular/core';
import { WOODSTOCK_LINK_GENERATOR } from '@helpers/link-generators';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { LogTableLoaderComponent } from '../log-table-loader/log-table-loader.component';

/** Displays auction action log for the given Woodstock player. */
@Component({
  selector: 'woodstock-player-auction-action-log',
  templateUrl: './woodstock-player-auction-action-log.component.html',
  styleUrls: ['./woodstock-player-auction-action-log.component.scss'],
})
export class WoodstockPlayerAuctionActionLogComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  @ViewChild('loader', { static: true }) public loader: LogTableLoaderComponent;
  public linkGenerator = WOODSTOCK_LINK_GENERATOR;

  /** Monitors retrieval of hte log table results. */
  public get getMonitor(): ActionMonitor {
    return this.loader.getMonitor;
  }

  constructor(public readonly woodstock: WoodstockService) {}
}
