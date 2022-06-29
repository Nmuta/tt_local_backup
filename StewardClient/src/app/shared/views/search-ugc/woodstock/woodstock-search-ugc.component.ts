import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { WoodstockUgcSearchService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-search.service';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { Params } from '@angular/router';

/** Retreives and displays Woodstock ugc by search filters. */
@Component({
  selector: 'woodstock-search-ugc',
  templateUrl: './woodstock-search-ugc.component.html',
  styleUrls: ['./woodstock-search-ugc.component.scss'],
})
export class WoodstockSearchUgcComponent extends BaseComponent implements OnInit {
  public gameTitle = GameTitleCodeName.FH5;
  public searchUgc$ = new Subject<UgcSearchFilters>();
  public ugcContent: PlayerUgcItem[] = [];
  public getMonitor = new ActionMonitor('GET UGC Content');
  public ugcType: UgcType = UgcType.Unknown;
  public filterXuid: BigNumber = undefined;
  public routerLink: string = '/app/tools/user-details/woodstock';
  public routerParams: Params = undefined;

  constructor(private readonly searchService: WoodstockUgcSearchService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.searchUgc$
      .pipe(
        tap(() => {
          this.ugcContent = [];
          this.filterXuid = undefined;
          this.routerParams = undefined;
        }),
        switchMap(filters => {
          this.ugcType = filters.ugcType;

          if (filters.xuid) {
            this.filterXuid = filters.xuid;
            this.routerParams = { lookupType: 'xuid', lookupName: filters.xuid };
          }

          this.getMonitor = this.getMonitor.repeat();

          return this.getSystemUgc$(filters).pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => EMPTY),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(results => {
        this.ugcContent = results;
      });
  }

  /** Searches player UGC content. */
  public getSystemUgc$(searchParameters: UgcSearchFilters): Observable<PlayerUgcItem[]> {
    return this.searchService.SearchUgc$(searchParameters);
  }

  /** Logic when UGC filters have changed. */
  public changeUgcSearchParameters($event: UgcSearchFilters): void {
    this.searchUgc$.next($event);
  }
}
