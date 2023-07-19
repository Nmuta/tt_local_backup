import { Component, Input, ViewChild } from '@angular/core';
import { SUNRISE_LINK_GENERATOR } from '@helpers/link-generators';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { LogTableLoaderComponent } from '../log-table-loader/log-table-loader.component';

/** Displays auction action log for the given Sunrise player. */
@Component({
  selector: 'sunrise-player-auction-action-log',
  templateUrl: './sunrise-player-auction-action-log.component.html',
  styleUrls: ['./sunrise-player-auction-action-log.component.scss'],
})
export class SunrisePlayerAuctionActionLogComponent {
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  @ViewChild('loader', { static: true }) public loader: LogTableLoaderComponent;
  public linkGenerator = SUNRISE_LINK_GENERATOR;

  /** Monitors retrieval of hte log table results. */
  public get getMonitor(): ActionMonitor {
    return this.loader.getMonitor;
  }

  constructor(public readonly sunrise: SunriseService) {}
}
