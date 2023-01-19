import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerUgcItem } from '@models/player-ugc-item';
import {
  DefaultUgcFilters,
  UgcAccessLevel,
  UgcFilters,
  UgcOrderBy,
  UgcType as UgcType,
} from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep, orderBy } from 'lodash';

export type UgcLookup = {
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
  /** REVIEW-COMMENT: Is using player identities. */
  @Input() public usingIdentities?: boolean;
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity?: IdentityResultUnion;
  /** REVIEW-COMMENT: Share code. */
  @Input() public shareCode?: string;
  /** REVIEW-COMMENT: Content type. */
  @Input() public contentType?: UgcType;

  public useCondensedTableView: boolean;
  public ugcContent: PlayerUgcItem[] = [];
  public filteredUgcContent: PlayerUgcItem[] = [];
  public searchUgc$ = new Subject<void>();
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcFilters = DefaultUgcFilters;

  public abstract gameTitle: GameTitle;

  constructor() {
    super();

    this.searchUgc$
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
    this.searchUgc$.next();
  }

  /** After view angular hook. */
  public ngAfterViewInit(): void {
    this.searchUgc$.next();
  }

  /** Logic when UGC filters have changed. */
  public changeUgcFilters($event: UgcFilters): void {
    this.ugcFilters = $event;
    this.filteredUgcContent = this.filterUgcContent();
  }

  /** Remove ugc items from the ugcContent so that filter changes reflect the right dataset. */
  public removeUgcItems(ugcItemsRemoved: string[]): void {
    ugcItemsRemoved.forEach(ugcId => {
      const index = this.ugcContent.findIndex(x => x.id == ugcId);
      this.ugcContent.splice(index, 1);
    });
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
