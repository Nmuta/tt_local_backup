import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerUgcItem } from '@models/player-ugc-item';
import {
  DefaultUGCFilters,
  UgcAccessLevel,
  UgcFilters,
  UgcOrderBy,
  UgcType as UgcType,
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
export abstract class PlayerUgcBaseComponent
  extends BaseComponent
  implements OnChanges, AfterViewInit
{
  @Input() public usingIdentities?: boolean;
  @Input() public identity?: IdentityResultUnion;
  @Input() public shareCode?: string;
  @Input() public contentType?: UgcType;

  public useCondensedTableView: boolean;
  public ugcContent: PlayerUgcItem[] = [];
  public filteredUgcContent: PlayerUgcItem[] = [];
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
          this.getMonitor = this.getMonitor.repeat();
          const noIdentitySelected = this.usingIdentities ? !this.identity?.xuid : !this.shareCode;
          if (noIdentitySelected) {
            return of([]);
          }

          return this.getPlayerUgc$(this.contentType).pipe(
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
  public abstract getPlayerUgc$(contentType: UgcType): Observable<PlayerUgcItem[]>;

  /** Angular on changes hook. */
  public ngOnChanges(): void {
    this.searchUGC$.next();
  }

  /** After view angular hook. */
  public ngAfterViewInit(): void {
    this.searchUGC$.next();
  }

  /** Logic when UGC filters have changed. */
  public changeUGCFilters($event: UgcFilters): void {
    this.ugcFilters = $event;
    this.filteredUgcContent = this.filterUgcContent();
  }

  private filterUgcContent(): PlayerUgcItem[] {
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

    if (this.ugcFilters.accessLevel === UgcAccessLevel.Public) {
      filteredContent = filteredContent.filter(x => x.isPublic);
    }

    if (this.ugcFilters.accessLevel === UgcAccessLevel.Private) {
      filteredContent = filteredContent.filter(x => !x.isPublic);
    }

    switch (this.ugcFilters.orderBy) {
      case UgcOrderBy.CreatedDateAsc:
        return orderBy(filteredContent, content => content.createdDateUtc, 'asc');
      case UgcOrderBy.CreatedDateDesc:
        return orderBy(filteredContent, content => content.createdDateUtc, 'desc');
      case UgcOrderBy.PopularityScoreAsc:
        return orderBy(filteredContent, content => content.popularityBucket, 'asc');
      case UgcOrderBy.PopularityScoreDesc:
        return orderBy(filteredContent, content => content.popularityBucket, 'desc');
      default:
        return filteredContent;
    }
  }
}
