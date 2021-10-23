import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { PlayerAuctionAction } from '@models/player-auction-action';
import { SunriseService } from '@services/sunrise';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { takeUntil } from 'rxjs/operators';

/** Displays auction action log for the given Sunrise player. */
@Component({
  selector: 'sunrise-player-auction-action-log',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunrisePlayerAuctionActionLogComponent extends BaseComponent implements OnInit {
  @Input() public identity: IdentityResultAlpha;

  public getMonitor = new ActionMonitor('GET Auction Action Logs');
  public auctionLog: PlayerAuctionAction[] = [];

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);

    // TODO: should keep getting after first
    this.sunrise
      .getPlayerAuctionLogByXuid$(this.identity.xuid)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(auctionLog => {
        this.auctionLog = auctionLog;
      });
  }
}
