import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseHideableUgc } from '@models/sunrise/sunrise-hideable-ugc.model';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { takeUntil } from 'rxjs/operators';

/** Retrieves and renders a player's sunrise hidden UGC. */
@Component({
  selector: 'sunrise-player-hidden-ugc',
  templateUrl: './sunrise-player-hidden-ugc.component.html',
  styleUrls: ['./sunrise-player-hidden-ugc.component.scss'],
})
export class SunrisePlayerHiddenUgcComponent extends BaseComponent implements OnChanges {
  @Input() public identity: IdentityResultAlpha;

  public hiddenUgc: SunriseHideableUgc[] = [];

  public getMonitor = new ActionMonitor('GET Hidden UGC');

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity.xuid) {
      this.hiddenUgc = [];
      return;
    }

    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);

    this.sunrise
      .getPlayerHiddenUGCByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(hiddenUgc => {
        this.hiddenUgc = hiddenUgc;
      });
  }
}
