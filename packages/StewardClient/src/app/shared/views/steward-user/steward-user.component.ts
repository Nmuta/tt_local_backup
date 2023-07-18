import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { UserService } from '@services/user';
import { EMPTY, Subject } from 'rxjs';
import { UserModel } from '@models/user.model';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';

/** The supported display options for Steward user */
export type StewardUserDisplayOption = 'name' | 'email';

/**
 *  Retrieves and displays Steward user information.
 */
@Component({
  selector: 'steward-user',
  templateUrl: './steward-user.component.html',
  styleUrls: ['./steward-user.component.scss'],
})
export class StewardUserComponent extends BaseComponent implements OnInit, OnChanges {
  /** Steward user id. */
  @Input() public objectId: GuidLikeString;
  /** Display options for the Steward user. Defaults to user's email. */
  @Input() public displayOption: StewardUserDisplayOption = 'email';

  public user: UserModel;

  private readonly getStewardUser$ = new Subject<void>();

  constructor(private readonly userService: UserService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getStewardUser$
      .pipe(
        switchMap(() => {
          this.user = undefined;
          return this.userService.getStewardUsers$({ userObjectIds: [this.objectId] });
        }),
        catchError(() => {
          this.user = undefined;
          return EMPTY;
        }),
        tap(returnUsers => {
          this.user = returnUsers[0];
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.getStewardUser$.next();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<StewardUserComponent>): void {
    this.getStewardUser$.next();
  }
}
