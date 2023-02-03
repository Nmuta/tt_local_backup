import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { flatMap } from 'lodash';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { GameTitle } from '@models/enums';
import {
  GiftHistoryDescription,
  GiftHistoryResultAndView,
  GiftHistoryResultUnion,
} from '@models/gift-history';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { makeItemList } from './helpers/make-item-list';
import { NEGATIVE_ONE } from '@helpers/bignumbers';
import { DateTime } from 'luxon';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export type GiftHistoryResultsServiceContract = {
  getGiftHistoryByPlayer$: () => Observable<GiftHistoryResultUnion[]>;
  getGiftHistoryByLspGroup$?: () => Observable<GiftHistoryResultUnion[]>;
};

/** Base gift history result component. */
@Component({
  selector: 'gift-history-results',
  templateUrl: './gift-history-results.component.html',
  styleUrls: ['./gift-history-results.component.scss'],
  providers: [HumanizePipe],
})
export class GiftHistoryResultsComponent extends BaseComponent implements OnChanges, OnInit {
  /** REVIEW-COMMENT: The gift history result service. */
  @Input() public service: GiftHistoryResultsServiceContract;
  /** REVIEW-COMMENT: Selected player. */
  @Input() public selectedPlayer: IdentityResultUnion;
  /** REVIEW-COMMENT: Selected Lsp Group */
  @Input() public selectedGroup: LspGroup;
  /** REVIEW-COMMENT: Player identities. */
  @Input() public usingPlayerIdentities: boolean; // TODO: This could be better named: usePlayerIdentities
  /** REVIEW-COMMENT: Game Title. */
  @Input() public gameTitle: GameTitle;
  /** REVIEW-COMMENT: Gift start date. */
  @Input() public startDate: DateTime;
  /** REVIEW-COMMENT: Gift end date. */
  @Input() public endDate: DateTime;
  /** REVIEW-COMMENT: Output when gift history is found. */
  @Output() public foundGiftHistoryList = new EventEmitter<GiftHistoryResultAndView[]>();

  public SENTINEL_VALUE = NEGATIVE_ONE;

  /** The error received while loading. */
  public getHistoryMonitor = new ActionMonitor('Get gift history');
  /** The gift history list to display. */
  public giftHistoryList: GiftHistoryResultAndView[];
  /** The warning message to display. */
  public giftHistoryDelay = 'Gift history data can take 5-10 minutes to appear after gifting.';

  private readonly getGiftHistory$ = new Subject<void>();

  /** Returns whether date filters are being used. */
  public get usingDateFilters(): boolean {
    return !!this.startDate && !!this.endDate;
  }

  constructor(private readonly humanizePipe: HumanizePipe) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for gift history results.');
    }

    if (!this.gameTitle) {
      throw new Error('No game title is defined for gift history results.');
    }

    this.getGiftHistory$
      .pipe(
        tap(() => {
          this.updateGiftHistoryList(undefined);
          this.getHistoryMonitor = this.getHistoryMonitor.repeat();
        }),
        filter(() => this.hasValidInputs()),
        switchMap(() => this.getGiftHistory()),
        switchMap(giftHistories => {
          const giftHistoriesView = giftHistories.map(history => {
            const historyView = history as GiftHistoryResultAndView;
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
        this.updateGiftHistoryList(giftHistories);
      });

    if (!!this.selectedGroup || !!this.selectedPlayer) {
      this.getGiftHistory$.next();
    }
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<GiftHistoryResultsComponent>): void {
    this.getGiftHistory$.next();
  }

  /** Generates the gift history description list to display for each gift history entry. */
  public generateDescriptionList(giftHistory: GiftHistoryResultUnion): GiftHistoryDescription[] {
    const descriptionList: GiftHistoryDescription[] = [];
    const inventory = giftHistory.giftInventory.inventory;

    for (const key in inventory) {
      if (inventory[key]?.length <= 0) {
        continue;
      }

      descriptionList.push({
        title: this.humanizePipe.transform(key),
        quantity: inventory[key]?.length,
      });
    }

    return descriptionList;
  }

  /** Generates the gift history item list to display for each gift history entry. */
  public generateItemsList(giftHistory: GiftHistoryResultUnion): PlayerInventoryItemList[] {
    const itemList: PlayerInventoryItemList[] = [];
    const inventory = giftHistory.giftInventory.inventory;

    for (const key in inventory) {
      if (inventory[key]?.length <= 0) {
        continue;
      }

      itemList.push(
        makeItemList(this.humanizePipe.transform(key), giftHistory.giftInventory.inventory[key]),
      );
    }

    return itemList;
  }

  private updateGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList;
    this.foundGiftHistoryList.emit(giftHistoryList);
  }

  private getGiftHistory(): Observable<GiftHistoryResultUnion[]> {
    return (
      this.usingPlayerIdentities
        ? this.service.getGiftHistoryByPlayer$()
        : this.service.getGiftHistoryByLspGroup$()
    ).pipe(
      this.getHistoryMonitor.monitorSingleFire(),
      catchError(_error => {
        this.updateGiftHistoryList(undefined);
        return EMPTY;
      }),
    );
  }

  private hasValidInputs(): boolean {
    return (
      (this.usingPlayerIdentities && !!this.selectedPlayer) ||
      (!this.usingPlayerIdentities && !!this.selectedGroup)
    );
  }
}
