import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { NEVER, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  template: '',
})
export abstract class ConsolesBaseComponent<T> extends BaseComponent implements OnChanges {
  @Input() public identity?: IdentityResultUnion;

  public consoleDetails: T[];
  public columnsToDisplay = ['isBanned', 'consoleId', 'deviceType', 'actions'];

  public bannedIcon = faGavel;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public abstract gameTitle: GameTitleCodeName;
  public abstract supportsConsoleBanning: boolean;

  /** Gets the console details list from XUID. */
  public abstract getConsoleDetailsByXuid(xuid: bigint): Observable<T[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const getConsoleDetailsByXuid$ = this.getConsoleDetailsByXuid(this.identity.xuid);
    getConsoleDetailsByXuid$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
      )
      .subscribe(consoleDetails => {
        this.isLoading = false;
        this.consoleDetails = consoleDetails;
      });
  }
}
