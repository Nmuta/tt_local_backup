import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerUGCItem } from '@models/player-ugc-item';
import {
  DefaultUGCFilters,
  UGCAccessLevel,
  UGCFilters,
  UGCOrderBy,
  UGCType,
} from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep, orderBy } from 'lodash';

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
  implements OnChanges, AfterViewInit
{
  @Input() public usingIdentities?: boolean;
  @Input() public identity?: IdentityResultUnion;
  @Input() public shareCode?: string;
  @Input() public contentType?: UGCType;

  public useCondensedTableView: boolean;
  public ugcContent: PlayerUGCItem[] = [];
  public filteredUgcContent: PlayerUGCItem[] = [];
  public searchUGC$ = new Subject<void>();
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcFilters = DefaultUGCFilters;

  public abstract gameTitle: GameTitleCodeName;

  constructor() {
    super();

    this.searchUGC$
      .pipe(
        tap(() => {
          this.ugcContent, (this.filteredUgcContent = []);
        }),
        switchMap(() => {
          this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
          const noIdentitySelected = this.usingIdentities ? !this.identity?.xuid : !this.shareCode;
          if (noIdentitySelected) {
            return of([]);
          }

          return this.getPlayerUGC$(this.contentType).pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => EMPTY),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(results => {
        this.ugcContent = results;
        this.filteredUgcContent = this.filterUgcContent();
      });
  }

  /** Searches player UGC content. */
  public abstract getPlayerUGC$(contentType: UGCType): Observable<PlayerUGCItem[]>;

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
    this.ugcFilters = $event;
    this.filteredUgcContent = this.filterUgcContent();
  }

  private filterUgcContent(): PlayerUGCItem[] {
    let filteredContent = cloneDeep(this.ugcContent);

    if (!!this.ugcFilters?.carId) {
      filteredContent = filteredContent.filter(x => {
        return x.carId.isEqualTo(this.ugcFilters.carId);
      });
    } else if (!!this.ugcFilters?.makeId) {
      filteredContent = filteredContent.filter(x => x.makeId.isEqualTo(this.ugcFilters.makeId));
    }

    if (!!this.ugcFilters.keyword) {
      filteredContent = filteredContent.filter(
        x =>
          x.title.indexOf(this.ugcFilters.keyword) >= 0 ||
          x.description.indexOf(this.ugcFilters.keyword) >= 0,
      );
    }

    if (this.ugcFilters.accessLevel === UGCAccessLevel.Public) {
      filteredContent = filteredContent.filter(x => x.isPublic);
    }

    if (this.ugcFilters.accessLevel === UGCAccessLevel.Private) {
      filteredContent = filteredContent.filter(x => !x.isPublic);
    }

    switch (this.ugcFilters.orderBy) {
      case UGCOrderBy.CreatedDateAsc:
        return orderBy(filteredContent, content => content.createdDateUtc, 'asc');
      case UGCOrderBy.CreatedDateDesc:
        return orderBy(filteredContent, content => content.createdDateUtc, 'desc');
      case UGCOrderBy.PopularityScoreAsc:
        return orderBy(filteredContent, content => content.popularityBucket, 'asc');
      case UGCOrderBy.PopularityScoreDesc:
        return orderBy(filteredContent, content => content.popularityBucket, 'desc');
      default:
        return filteredContent;
    }
  }
}
