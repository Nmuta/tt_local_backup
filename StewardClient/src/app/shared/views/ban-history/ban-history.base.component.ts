import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LiveOpsBanDescription } from '@models/sunrise';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Sunrise Ban history by XUID. */
@Component({
  template: '',
})
export abstract class BanHistoryBaseComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: BigNumber;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: LiveOpsBanDescription[];

  /** The columns + order to display. */
  public columnsToDisplay = ['isActive', 'reason', 'featureArea', 'startTimeUtc', 'expireTimeUtc'];

  public abstract gameTitle: GameTitleCodeName;
  public abstract getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const getBanHistoryByXuid$ = this.getBanHistoryByXuid$(this.xuid);
    getBanHistoryByXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error; // TODO: Display something useful to the user
          return EMPTY;
        }),
      )
      .subscribe(banHistory => {
        this.isLoading = false;
        this.banList = banHistory;
      });
  }
}
