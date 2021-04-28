import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import _ from 'lodash';
import { NEVER, Observable } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  template: '',
})
export abstract class UserFlagsBaseComponent<T> extends BaseComponent implements OnChanges {
  /** The XUID to look up. */
  @Input() public identity: IdentityResultUnion;
  /** Boolean determining if flags can be edited. */
  @Input() public disabled: boolean = false;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The flags currently applied to the user. */
  public currentFlags: T;
  /** The modified flags. */
  public flags: T;
  /** True when the "I have verified this" checkbox is ticked. Reset on model change. */
  public verified = false;
  /** True while waiting to submit. */
  public isSubmitting: boolean;
  /** The error received when submitting. */
  public submitError: unknown;

  public abstract gameTitle: GameTitleCodeName;
  public abstract getFlagsByXuid(xuid: BigNumber): Observable<T>;
  public abstract putFlagsByXuid(xuid: BigNumber, newFlags: T): Observable<T>;

  /** True if changes have been made to the flags. */
  public get hasChanges(): boolean {
    return !_.isEqual(this.currentFlags, this.flags);
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    const getFlagsByXuid$ = this.getFlagsByXuid(this.identity.xuid);
    getFlagsByXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe(flags => {
        this.isLoading = false;
        this.currentFlags = flags;
        this.setFlagsToCurrent();
      });
  }

  /** Submits the changes. */
  public makeAction(): Observable<T> {
    const putFlagsByXuid$ = this.putFlagsByXuid(this.identity.xuid, this.flags);
    return putFlagsByXuid$.pipe(
      takeUntil(this.onDestroy$),
      catchError(error => {
        this.isLoading = false;
        this.loadError = error;
        return NEVER;
      }),
      take(1),
      tap(value => {
        this.currentFlags = value;
        this.setFlagsToCurrent();
      }),
    );
  }

  /** Resets the flag visuals. */
  public setFlagsToCurrent(): void {
    this.flags = _.clone(this.currentFlags);
  }
}
