import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { WoodstockProfileSummary } from '@models/woodstock';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { SunriseProfileSummary } from '@models/sunrise';
import { GameTitleCodeName } from '@models/enums';

export type ProfileSummaryUnion = SunriseProfileSummary | WoodstockProfileSummary;

/** Retrieves and displays a player's profile overview by XUID. */
@Component({
  template: '',
})
export abstract class ProfileOverviewBaseComponent<T extends ProfileSummaryUnion>
  extends BaseComponent
  implements OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** The overview data. */
  public profileSummary: T;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public abstract gameTitle: GameTitleCodeName;
  public abstract getProfileSummaryByXuid$(xuid: BigNumber): Observable<T>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity || !this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    const getProfileSummaryByXuid$ = this.getProfileSummaryByXuid$(this.identity.xuid);
    getProfileSummaryByXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
      )
      .subscribe(summary => {
        this.isLoading = false;
        this.profileSummary = summary;
      });
  }
}
