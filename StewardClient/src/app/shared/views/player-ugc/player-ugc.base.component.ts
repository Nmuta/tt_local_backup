import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { NEVER, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { DefaultUGCFilters, UGCFilters } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

export type UGCLookup = {
  usingIdentities?: boolean;
  identity?: IdentityResultUnion;
  shareCode?: string;
};

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  template: '',
})
export abstract class PlayerUGCBaseComponent
  extends BaseComponent
  implements OnChanges, AfterViewInit {
  @Input() public usingIdentities?: boolean;
  @Input() public identity?: IdentityResultUnion;
  @Input() public shareCode?: string;

  public useCondensedTableView: boolean;
  public ugcContent: PlayerUGCItem[] = [];
  public searchUGC$ = new Subject();
  public getMonitor = new ActionMonitor('GET UGC Content');
  public currentFilters = DefaultUGCFilters;

  public abstract gameTitle: GameTitleCodeName;

  constructor() {
    super();

    this.searchUGC$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => {
          this.ugcContent = [];
        }),
        switchMap(() => {
          this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
          const noIdentitySelected = this.usingIdentities ? !this.identity?.xuid : !this.shareCode;
          if (noIdentitySelected) {
            return of([]);
          }

          return this.getPlayerUGC$(this.currentFilters).pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => NEVER),
          );
        }),
      )
      .subscribe(results => {
        this.ugcContent = results;
      });
  }

  /** Searches player UGC content. */
  public abstract getPlayerUGC$(filters: UGCFilters): Observable<PlayerUGCItem[]>;

  /** Angular on changes hook. */
  public ngOnChanges(): void {
    this.searchUGC$.next();
  }

  /** After view angular hook. */
  public ngAfterViewInit(): void {
    this.searchUGC$.next();
  }

  /** Logic when UGC filters have changed. */
  public changeUGCFilters($event: UGCFilters): void {
    this.currentFilters = $event;
    this.searchUGC$.next();
  }
}
