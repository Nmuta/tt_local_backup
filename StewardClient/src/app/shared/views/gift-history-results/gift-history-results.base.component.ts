import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { NEVER, Observable } from 'rxjs';
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
  public giftHistoryList$: Observable<U>;

  public isActiveIcon = faCheck;
  
  constructor() {
    super();
  }
  
  public abstract retrieveHistoryByPlayer(): Observable<U>;
  public abstract retrieveHistoryByLspGroup(): Observable<U>;

    public ngOnInit(): void {  
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.isLoading = true;
        const getGiftHistory$ = this.usingPlayerIdentities ? this.retrieveHistoryByPlayer() : this.retrieveHistoryByLspGroup();

        this.giftHistoryList$ = getGiftHistory$.pipe(
            takeUntil(this.onDestroy$),
            catchError(error => {
                this.isLoading=false;
                this.loadError = error;
                return NEVER;
            }),
            tap(giftHistories => {
                console.log("in the tap");
                this.isLoading = false;
                this.giftHistoryList = giftHistories;
            })
        )
    }
}
