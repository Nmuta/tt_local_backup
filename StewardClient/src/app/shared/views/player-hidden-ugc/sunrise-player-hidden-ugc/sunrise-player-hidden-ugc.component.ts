import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

/** Retrieves and renders a player's sunrise hidden UGC. */
@Component({
  selector: 'sunrise-player-hidden-ugc',
  templateUrl: './sunrise-player-hidden-ugc.component.html',
  styleUrls: ['./sunrise-player-hidden-ugc.component.scss'],
})
export class SunrisePlayerHiddenUgcComponent {
  @Input() public identity: IdentityResultAlpha;
  public getMonitor: ActionMonitor;

  constructor(public readonly service: SunriseService) {}

  /** Retrieve child monitor for use with reload spinner in User Details tab. */
  public prepareMonitor(childMonitor: ActionMonitor) {
    this.getMonitor = childMonitor;
  }
}
