import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';
import { GameTitle } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { ProfileNote } from '@models/profile-note.model';

/** Base component for displaying user profile notes by XUID. */
@Component({
  template: '',
})
export abstract class ProfileNotesBaseComponent extends BaseComponent implements OnChanges {
  /** The XUID to look up. */
  @Input() public identity: IdentityResultUnion;

  /** The user's profile rollback details. */
  public profileNotes: ProfileNote[];
  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  public displayColumns: string[] = ['date', 'author', 'text'];

  /** Game title. */
  public abstract gameTitle: GameTitle;

  public abstract getProfileNotesXuid$(xuid: BigNumber): Observable<ProfileNote[]>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    const getProfileNotesXuid$ = this.getProfileNotesXuid$(this.identity.xuid);
    getProfileNotesXuid$
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(notes => {
        this.isLoading = false;
        this.profileNotes = notes;
      });
  }
}
