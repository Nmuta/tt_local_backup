import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { NEVER, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';

/** Base component for displaying user profile rollbacks by XUID. */
@Component({
  template: '',
})
export abstract class ProfileRollbacksBaseComponent<T> extends BaseComponent implements OnChanges {
  /** The XUID to look up. */
  @Input() public identity: IdentityResultUnion;

  /** The user's profile rollback details. */
  public profileRollbacks: T[];
  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public displayColumns: string[] = ['date', 'author', 'details'];

  /** Game title. */
  public abstract gameTitle: GameTitleCodeName;

  public abstract getProfileRollbacksXuid$(xuid: BigNumber): Observable<T[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    const getProfileRollbacksXuid$ = this.getProfileRollbacksXuid$(this.identity.xuid);
    getProfileRollbacksXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe(rollbacks => {
        this.isLoading = false;
        this.profileRollbacks = rollbacks;
      });
  }
}
