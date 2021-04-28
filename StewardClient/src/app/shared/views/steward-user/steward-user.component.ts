import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { UserService } from '@services/user';
import { NEVER, Subject } from 'rxjs';
import { UserModel } from '@models/user.model';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Retrieves and displays Steward user information.
 */
@Component({
  selector: 'steward-user',
  templateUrl: './steward-user.component.html',
  styleUrls: ['./steward-user.component.scss'],
})
export class StewardUserComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() public objectId: GuidLikeString;

  public user: UserModel;

  private readonly getStewardUser$ = new Subject<UserModel>();

  constructor(private readonly userService: UserService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.getStewardUser$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          this.user = undefined;
          return this.userService.getStewardUsers({ userObjectIds: [this.objectId] });
        }),
        catchError(() => {
          this.user = undefined;
          return NEVER;
        }),
        tap(returnUsers => {
          this.user = returnUsers[0];
        }),
      )
      .subscribe();

    this.getStewardUser$.next();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.getStewardUser$.next();
  }
}
