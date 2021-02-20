import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { NEVER, Observable, Subject } from 'rxjs';
import { GravityGiftHistory } from '@models/gravity';
import { SunriseGiftHistory } from '@models/sunrise';
import { ApolloGiftHistory } from '@models/apollo';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

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
  implements OnChanges, OnInit {
  @Input() public selectedPlayer: T;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public isLoading = false;
  /** The gift history list to display. */
  public giftHistoryList: U;

  private readonly intermediate$ = new Subject<void>();

  public abstract retrieveHistoryByPlayer(): Observable<U>;
  public abstract retrieveHistoryByLspGroup(): Observable<U>;

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.intermediate$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => {
          this.giftHistoryList = undefined;
        }),
        filter( () => 
          (this.usingPlayerIdentities && !!this.selectedPlayer) ||
          (!this.usingPlayerIdentities && !!this.selectedGroup)
        ),
        switchMap( () => {
          this.isLoading = true;

          return this.usingPlayerIdentities
          ? this.retrieveHistoryByPlayer()
          : this.retrieveHistoryByLspGroup();
        }),
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
      )
      .subscribe();

      if (!!this.selectedGroup || !!this.selectedPlayer){
        this.intermediate$.next();
      }
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.intermediate$.next();
  }
}
