import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { UserRole } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { UserModelWithPermissions } from '@models/user.model';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { PermAttribute } from '@services/perm-attributes/perm-attributes';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep, find, sortBy } from 'lodash';
import { debounceTime, filter, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { VerifyUserSwitchDialogComponent } from '../verify-user-switch-dialong/verify-user-switch-dialog.component';

/** Tools that displays Steward users and allows one to be selected. */
@Component({
  selector: 'select-user-from-list',
  templateUrl: './select-user-from-list.component.html',
  styleUrls: ['./select-user-from-list.component.scss'],
})
export class SelectUserFromListComponent extends BaseComponent implements OnInit {
  /** Enables/disables user selection. */
  @Input() public allowSelection: boolean = false;
  /** Prompts user change with a verification popup. */
  @Input() public verifyUserChange: boolean = false;
  /** Outputs selected user changes. */
  @Output() public selectedUserChange = new EventEmitter<UserModelWithPermissions>();
  /** Outputs a user's attributes. */
  @Output() public userAttributesChange = new EventEmitter<PermAttribute[]>();

  public getUsersActionMonitor = new ActionMonitor('GET all Steward users');
  public postSyncUsersDbActionMonitor = new ActionMonitor('POST sync users DB');

  public allUsers: UserModelWithPermissions[];
  public filteredUsers: UserModelWithPermissions[];
  public selectedUser: UserModelWithPermissions;

  public selectUserToManage$ = new Subject<UserModelWithPermissions>();
  public nameFilterFormControl = new FormControl(null);

  public get isUserSelected(): boolean {
    return !!this.selectedUser;
  }

  public get selectedUserId(): string {
    return this.selectedUser?.objectId ?? '';
  }

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly v2UsersService: V2UsersService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.initStewardUsersList();

    let pendingUser: UserModelWithPermissions;
    this.selectUserToManage$
      .pipe(
        filter(() => this.allowSelection),
        filter(v => !!v),
        tap(v => (pendingUser = v)),
        // Check for pending changes before switching
        switchMap(() => {
          if (!this.verifyUserChange) return of(true);

          const dialogRef = this.dialog.open(VerifyUserSwitchDialogComponent);
          return dialogRef.afterClosed();
        }),
        filter(v => !!v),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.selectedUser = pendingUser;
        this.selectedUserChange.emit(this.selectedUser);
      });

    this.nameFilterFormControl.valueChanges
      .pipe(debounceTime(HCI.TypingToAutoSearchDebounceMillis), takeUntil(this.onDestroy$))
      .subscribe(value => {
        let users = cloneDeep(this.allUsers);
        const filterValue = value?.toLowerCase()?.trim();
        if (!!filterValue && filterValue.length > 0) {
          users = users.filter(
            user =>
              user.name.toLowerCase().includes(filterValue) ||
              user.emailAddress.toLowerCase().includes(filterValue),
          );
        }

        this.filteredUsers = users;
      });
  }

  /** Sets the user's perm attributes.  */
  public updateUserAttributes(userId: GuidLikeString, updatedAttributes: PermAttribute[]): void {
    const foundUser = find(this.allUsers, user => user.objectId == userId);

    if (!!foundUser) {
      foundUser.attributes = updatedAttributes;
      this.nameFilterFormControl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
  }

  /** Syncs the user DB. */
  public syncUsersDb(): void {
    this.postSyncUsersDbActionMonitor = this.postSyncUsersDbActionMonitor.repeat();
    this.v2UsersService
      .syncDb$()
      .pipe(this.postSyncUsersDbActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.initStewardUsersList();
      });
  }

  /** Gets the Steward user list and loads it into the component. */
  private initStewardUsersList(): void {
    this.getUsersActionMonitor = this.getUsersActionMonitor.repeat();
    this.userService
      .getAllStewardUsers$()
      .pipe(this.getUsersActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(users => {
        const generalUsers = users.filter(user => user.role === UserRole.GeneralUser);

        this.allUsers = sortBy(generalUsers, user => {
          return user.name;
        }) as UserModelWithPermissions[];

        this.filteredUsers = cloneDeep(this.allUsers);
      });
  }
}
