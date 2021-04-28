import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';

/** Base component for related gamertags. */
@Component({
  template: '',
})
export abstract class GamertagsBaseComponent<T> extends BaseComponent implements OnChanges {
  @Input() public identity?: IdentityResultUnion;

  /** The retrieved list of shared users. */
  public sharedConsoleUsers: T[];
  public columnsToDisplay = ['everBanned', 'gamertag', 'sharedConsoleId', 'xuid'];

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public abstract gameTitle: GameTitleCodeName;
  /** The user details route. */
  public abstract userDetailsRouterLink: string[];

  /** Gets the shared console gamertag list. */
  public abstract getSharedConsoleUsersByXuid(xuid: BigNumber): Observable<T[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const getSharedConsoleUsersByXuid$ = this.getSharedConsoleUsersByXuid(this.identity.xuid);
    getSharedConsoleUsersByXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe(sharedConsoleUsers => {
        this.isLoading = false;
        this.sharedConsoleUsers = sharedConsoleUsers;
      });
  }
}
