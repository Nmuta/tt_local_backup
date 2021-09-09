import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import BigNumber from 'bignumber.js';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import { sortBy } from 'lodash';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

/** Retreives and displays a player's backstage pass history by XUID. */
@Component({
  template: '',
})
export abstract class BackstagePassHistoryBaseComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** A list of player backstage pass events. */
  public backstagePassHistory: BackstagePassHistory[];

  public columnsToDisplay = ['createdAtUtc', 'backstagePassAmount', 'transactionType', 'uniqueId'];

  public getBackstagePassHistory$ = new Subject<void>();
  public getMonitor = new ActionMonitor('GET Backstage Pass History');

  public abstract gameTitle: GameTitleCodeName;
  public abstract getBackstagePassHistoryByXuid$(
    xuid: BigNumber,
  ): Observable<BackstagePassHistory[]>;

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getBackstagePassHistory$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
          return this.getBackstagePassHistoryByXuid$(this.identity.xuid).pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => EMPTY),
          );
        }),
        map(history => sortBy(history, history => history.createdAtUtc).reverse()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(history => {
        this.backstagePassHistory = history;
      });

    if (!!this.identity?.xuid) {
      this.getBackstagePassHistory$.next();
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      return;
    }

    this.getBackstagePassHistory$.next();
  }
}
