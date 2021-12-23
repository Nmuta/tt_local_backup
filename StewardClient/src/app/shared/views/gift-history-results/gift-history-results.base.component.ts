import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { GravityGiftHistory } from '@models/gravity';
import { SunriseGiftHistory } from '@models/sunrise';
import { ApolloGiftHistory } from '@models/apollo';
import { SteelheadGiftHistory } from '@models/steelhead';
import { WoodstockGiftHistory } from '@models/woodstock';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { GameTitleCodeName } from '@models/enums';
import { MSError } from '@models/error.model';
import { flatMap } from 'lodash';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;
type GiftHistoryResultUnion =
  | WoodstockGiftHistory
  | SteelheadGiftHistory
  | GravityGiftHistory
  | SunriseGiftHistory
  | ApolloGiftHistory;

export type GiftHistoryView = {
  descriptionToShow: GiftHistoryDescription[];
  itemsToShow: PlayerInventoryItemList[];
  errors: MSError[];
};

export type GiftHistoryDescription = {
  title: string;
  quantity: number;
};

/** Base gift history result component. */
@Component({
  template: '',
})
export abstract class GiftHistoryResultsBaseComponent<
    T extends IdentityResultUnion,
    U extends GiftHistoryResultUnion
  >
  extends BaseComponent
  implements OnChanges, OnInit {
  @Input() public selectedPlayer: T;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public SENTINEL_VALUE = new BigNumber(-1);

  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public isLoading = false;
  /** The gift history list to display. */
  public giftHistoryList: (U & GiftHistoryView)[];
  /** The warning message to display. */
  public giftHistoryDelay = 'Gift history data can take 5-10 minutes to appear after gifting.';

  private readonly getGiftHistory$ = new Subject<void>();

  public abstract gameTitle: GameTitleCodeName;
  public abstract retrieveHistoryByPlayer$(): Observable<U[]>;
  public abstract retrieveHistoryByLspGroup$(): Observable<U[]>;

  /** Implement to specify the expando tables to show. */
  public abstract generateItemsList(giftHistory: U): PlayerInventoryItemList[];
  public abstract generateDescriptionList(giftHistory: U): GiftHistoryDescription[];

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getGiftHistory$
      .pipe(
        tap(() => {
          this.giftHistoryList = undefined;
          this.loadError = undefined;
        }),
        filter(
          () =>
            (this.usingPlayerIdentities && !!this.selectedPlayer) ||
            (!this.usingPlayerIdentities && !!this.selectedGroup),
        ),
        switchMap(() => {
          this.isLoading = true;

          return (this.usingPlayerIdentities
            ? this.retrieveHistoryByPlayer$()
            : this.retrieveHistoryByLspGroup$()
          ).pipe(
            catchError(error => {
              this.isLoading = false;
              this.loadError = error;
              this.giftHistoryList = undefined;
              return EMPTY;
            }),
          );
        }),
        switchMap(giftHistories => {
          const giftHistoriesView = giftHistories.map(history => {
            const historyView = history as U & GiftHistoryView;
            historyView.descriptionToShow = this.generateDescriptionList(history);
            historyView.itemsToShow = this.generateItemsList(history);
            const errors = flatMap(historyView.itemsToShow, itemToShow =>
              itemToShow.items.map(item => item.error).filter(error => !!error),
            );
            historyView.errors = errors;
            return historyView;
          });
          return of(giftHistoriesView);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(giftHistories => {
        this.isLoading = false;
        this.giftHistoryList = giftHistories;
      });

    if (!!this.selectedGroup || !!this.selectedPlayer) {
      this.getGiftHistory$.next();
    }
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.getGiftHistory$.next();
  }

  /** Utility method for generating master inventory list to display. */
  public makeItemList(title: string, items: MasterInventoryItem[]): PlayerInventoryItemList {
    return {
      title: title,
      description: `${items.length} Total`,
      items: items,
    } as PlayerInventoryItemList;
  }
}
