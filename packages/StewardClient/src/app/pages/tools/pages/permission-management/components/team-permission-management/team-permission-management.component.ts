import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep, find } from 'lodash';
import { map, Observable, startWith, takeUntil } from 'rxjs';
import { StewardTeam } from '../../permission-management.models';
import { SelectTeamFromListComponent } from '../select-team-from-list/select-team-from-list.component';

interface PendingTeamChanges {
  originalMemberList: UserModel[];
  add: UserModel[];
  remove: UserModel[];
}

/** Displays the Steward teams permission management tool. */
@Component({
  templateUrl: './team-permission-management.component.html',
  styleUrls: ['./team-permission-management.component.scss'],
})
export class TeamPermissionManagementComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SelectTeamFromListComponent) sidebarComponent: SelectTeamFromListComponent;

  public selectedTeam: StewardTeam;
  public allUsers: UserModel[];
  public availableUsers: UserModel[];

  public getUsersMonitor = new ActionMonitor('GET Steward users');
  public getTeamMonitor = new ActionMonitor('GET Steward team');
  public saveTeamMonitor = new ActionMonitor('POST save team changes');
  public deleteTeamMonitor = new ActionMonitor('DELETE team');
  public formControls = {
    name: new UntypedFormControl('', Validators.required),
    filterUser: new UntypedFormControl(''),
  };
  public formGroup = new UntypedFormGroup(this.formControls);
  public filteredUsers$: Observable<UserModel[]>;

  public membersTable = new BetterMatTableDataSource<UserModel>();
  public displayedColumns = ['name', 'id', 'actions'];

  public pendingChanges: PendingTeamChanges = {
    originalMemberList: [],
    add: [],
    remove: [],
  };

  constructor(
    private readonly userService: UserService,
    private readonly v2UserService: V2UsersService,
  ) {
    super();
  }

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.userService
      .getAllStewardUsers$()
      .pipe(this.getUsersMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(users => {
        this.allUsers = users.filter(user => user.role === UserRole.GeneralUser);
        this.availableUsers = this.allUsers;
      });

    this.filteredUsers$ = this.formControls.filterUser.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || '')),
    );
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.membersTable.paginator = this.paginator;
  }

  /** Logic when a new team is selected. */
  public selectedTeamChange(selectedTeam: StewardTeam): void {
    const teamLead = selectedTeam.teamLead;
    this.getTeamMonitor = this.getTeamMonitor.repeat();
    this.v2UserService
      .getStewardTeam$(teamLead.objectId)
      .pipe(this.getTeamMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(team => {
        team.teamLead = teamLead;
        this.selectedTeam = team;
        this.formControls.name.setValue(this.selectedTeam.name);
        const originalMemberList = this.selectedTeam.members.map(memberId =>
          find(this.allUsers, user => user.objectId === memberId),
        );
        this.membersTable.data = originalMemberList;

        this.pendingChanges = {
          originalMemberList: cloneDeep(originalMemberList),
          add: [],
          remove: [],
        };

        // Remove team lead from list of available users to add to team
        this.availableUsers = this.allUsers.filter(user => {
          if (
            !!this.selectedTeam &&
            this.selectedTeam.teamLead.objectId.toLowerCase() !== user.objectId.toLowerCase()
          ) {
            return user;
          }
        });
      });
  }

  /** Saves the team changes. */
  public saveTeamChanges(): void {
    if (!this.selectedTeam || !this.formGroup.valid) {
      return;
    }

    const team: StewardTeam = {
      name: this.formControls.name.value,
      members: this.membersTable.data.map(member => member.objectId),
      teamLead: this.selectedTeam.teamLead,
    };

    this.saveTeamMonitor = this.saveTeamMonitor.repeat();
    this.v2UserService
      .setStewardTeam$(team)
      .pipe(this.saveTeamMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(updatedTeam => {
        // Reset team members and tool initialization
        this.selectedTeam.members = updatedTeam.members;
        this.selectedTeamChange(this.selectedTeam);
      });
  }

  /** Deletes user team. */
  public deleteTeam(): void {
    this.deleteTeamMonitor = this.deleteTeamMonitor.repeat();
    this.v2UserService
      .deleteStewardTeam$(this.selectedTeam.teamLead.objectId)
      .pipe(this.deleteTeamMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        // Reload sidebar lists
        this.sidebarComponent.onTeamDeleted();
        this.selectedTeam = undefined;
      });
  }

  /** Adds user to the team members list. */
  public addUserToTeam(user: UserModel): void {
    if (!user) {
      return;
    }

    this.formControls.filterUser.setValue('');
    const membersTable = this.membersTable.data;
    const inMembersTable = !!find(this.membersTable.data, u => u.objectId === user.objectId);
    if (!inMembersTable) {
      membersTable.push(user);
      this.membersTable.data = membersTable;
    }

    this.updatePendingChanges(user, true);
  }

  /** Removes user to the team members list. */
  public removeUserFromTeam(user: UserModel): void {
    if (!user) {
      return;
    }

    this.membersTable.data = this.membersTable.data.filter(u => u.objectId !== user.objectId);
    this.updatePendingChanges(user, false);
  }

  /** The autocomplete text display function for user list. */
  public userAutoCompleteDisplayFn(user: UserModel): string {
    if (!user) {
      return '';
    }

    return `${user.name} (${user.emailAddress})`;
  }

  private _filterUsers(value: string): UserModel[] {
    if (!value || typeof value !== 'string') {
      return this.availableUsers;
    }

    const filterValue = value.toLowerCase();
    return this.availableUsers.filter(
      user =>
        user.name.toLowerCase().includes(filterValue) ||
        user.emailAddress.toLowerCase().includes(filterValue) ||
        user.objectId.toLowerCase().includes(filterValue),
    );
  }

  private updatePendingChanges(user: UserModel, add: boolean): void {
    this.pendingChanges.add = this.pendingChanges.add.filter(u => user.objectId !== u.objectId);
    this.pendingChanges.remove = this.pendingChanges.remove.filter(
      u => user.objectId !== u.objectId,
    );

    // Update pending changes only if it updates the original members list
    const isUserInOriginalList = !!find(
      this.pendingChanges.originalMemberList,
      member => member.objectId === user.objectId,
    );
    if (!isUserInOriginalList && add) {
      this.pendingChanges.add.push(user);
    } else if (isUserInOriginalList && !add) {
      this.pendingChanges.remove.push(user);
    }
  }
}
