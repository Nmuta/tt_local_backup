import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { HideableUgc } from '@models/hideable-ugc.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { takeUntil } from 'rxjs/operators';

/** Retrieves and renders a player's woodstock hidden UGC. */
@Component({
  selector: 'woodstock-player-hidden-ugc',
  templateUrl: './woodstock-player-hidden-ugc.component.html',
  styleUrls: ['./woodstock-player-hidden-ugc.component.scss'],
})
export class WoodstockPlayerHiddenUgcComponent extends BaseComponent implements OnChanges {
  @Input() public identity: IdentityResultAlpha;

  public hiddenUgc: HideableUgc[] = [];

  public getMonitor = new ActionMonitor('GET Hidden UGC');

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity.xuid) {
      this.hiddenUgc = [];
      return;
    }

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);

    this.woodstock
      .getPlayerHiddenUGCByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(hiddenUgc => {
        this.hiddenUgc = hiddenUgc;
      });
  }
}
