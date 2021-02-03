import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { merge, NEVER, Observable, Subject } from 'rxjs';
import { GravityGiftHistory } from '@models/gravity';
import { SunriseGiftHistory } from '@models/sunrise';
import { ApolloGiftHistory } from '@models/apollo';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;
type GiftHistoryResultUnion = (GravityGiftHistory | SunriseGiftHistory | ApolloGiftHistory)[];

/** Base gift history result component. */
@Component({
  template: '',
})
export abstract class GiftHistoryResultsBaseComponent<
    T extends IdentityResultUnion,
    U extends GiftHistoryResultUnion
  >
  extends BaseComponent
  implements OnChanges {
  @Input() public selectedPlayer: T;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public isLoading = false;
  /** The gift history list to display. */
  public giftHistoryList: U;

  public abstract retrieveHistoryByPlayer(): Observable<U>;
  public abstract retrieveHistoryByLspGroup(): Observable<U>;


  private readonly intermediate = new Subject<Observable<U>>();
  public ngOnInit() {
    this.intermediate.pipe(
      switchMap(s => s),
      takeUntil(this.onDestroy$),
      tap(() => {
        this.isLoading = false;
      }),
      catchError(error => {
        this.loadError = error;
        this.giftHistoryList = undefined;
        return NEVER;
      }),
      tap(giftHistories => {
        this.giftHistoryList = giftHistories;
      }),
    ).subscribe();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    if (
      (this.usingPlayerIdentities && !this.selectedPlayer) ||
      (!this.usingPlayerIdentities && !this.selectedGroup)
    ) {
      this.giftHistoryList = undefined;
      this.isLoading = false;

      this.intermediate.next(NEVER);
      return;
    }

    this.isLoading = true;

    const getGiftHistory$ = this.usingPlayerIdentities
    ? this.retrieveHistoryByPlayer()
    : this.retrieveHistoryByLspGroup();

    this.intermediate.next(getGiftHistory$);
  }
}
