import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { NEVER, Observable, Subject } from 'rxjs';
import { GravityGiftHistories } from '@models/gravity';
import { SunriseGiftHistories } from '@models/sunrise';
import { ApolloGiftHistories } from '@models/apollo';
import { catchError, takeUntil, tap } from 'rxjs/operators';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;
type GiftHistoryResultUnion = GravityGiftHistories | SunriseGiftHistories | ApolloGiftHistories;

/** Base gift history result component. */
@Component({
    template: '',
  })
export abstract class GiftHistoryResultsBaseComponent<T extends IdentityResultUnion, U extends GiftHistoryResultUnion>
  extends BaseComponent
  implements OnChanges {
  @Input() public selectedPlayer: T;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public cancelGiftHistoryRequest$: Observable<void>;

  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public isLoading = false;
  /** The gift history list to display. */
  public giftHistoryList: U;

  public isActiveIcon = faCheck;
  
  constructor() {
    super();
  }
  
  public abstract retrieveHistoryByPlayer(): Observable<U>;
  public abstract retrieveHistoryByLspGroup(): Observable<U>;

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    // Verify component data is valid before sending off request
    if((this.usingPlayerIdentities && !this.selectedPlayer) || (!this.usingPlayerIdentities && !this.selectedGroup)) {
      // Cancel the previous observable is the user clears out the existing lookup information
      (this.cancelGiftHistoryRequest$ as Subject<void>)?.next();
      (this.cancelGiftHistoryRequest$ as Subject<void>)?.complete();
      this.giftHistoryList = null;
      return;
    }

    this.isLoading = true;
    this.cancelGiftHistoryRequest$ = new Subject<void>();

    const getGiftHistory$ = this.usingPlayerIdentities ? this.retrieveHistoryByPlayer() : this.retrieveHistoryByLspGroup();
    getGiftHistory$.pipe(
      takeUntil(this.onDestroy$ || this.cancelGiftHistoryRequest$),
      catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
      }),
      tap(giftHistories => {
          this.isLoading = false;
          this.giftHistoryList = giftHistories;
      })).subscribe();
  }
}
