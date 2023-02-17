import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { map, Observable, startWith, takeUntil } from 'rxjs';
import { StewardTeam } from '../../permission-management.models';

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

  public selectedTeam: StewardTeam;
  public allUsers: UserModel[];
  public availableUsers: UserModel[];

  public getUsersMonitor = new ActionMonitor('GET Steward users');
  public saveTeamMonitor = new ActionMonitor('POST save team changes');
  public formControls = {
    name: new FormControl('', Validators.required),
    filterUser: new FormControl(''),
  };
  public formGroup = new FormGroup(this.formControls);
  public filteredUsers$: Observable<UserModel[]>;

  public membersTable = new BetterMatTableDataSource<string>();
  public displayedColumns = ['name', 'id', 'actions'];

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
  public selectedTeamChange(team: StewardTeam): void {
    this.selectedTeam = team;
    this.formControls.name.setValue(this.selectedTeam.name);

    // Remove team lead from list of available users to add to team
    // TODO - this needs to be moved separatly OR
    // We just handle invalid users during time of adding (prefer this as this is just a admin tool)
    this.availableUsers = this.allUsers.filter(user => {
      if (
        !!this.selectedTeam &&
        this.selectedTeam.teamLead.objectId.toLowerCase() !== user.objectId.toLowerCase()
      ) {
        return user;
      }
    });

    this.membersTable.data = this.selectedTeam.members;
  }

  /** Saves the team changes. */
  public saveTeamChanges(): void {
    if (!this.selectedTeam || !this.formGroup.valid) {
      return;
    }

    const team: StewardTeam = {
      name: this.formControls.name.value,
      members: this.selectedTeam.members,
      teamLead: this.selectedTeam.teamLead,
    };

    this.saveTeamMonitor = this.saveTeamMonitor.repeat();
    this.v2UserService
      .setStewardTeam$(team)
      .pipe(this.saveTeamMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(updatedTeam => {
        this.selectedTeam = updatedTeam;

        // Update the team in the selection tile.
      });
  }

  /** Adds user to the team members list. */
  public addUserToTeam(event: MatAutocompleteSelectedEvent): void {
    if (!event) {
      return;
    }

    this.formControls.filterUser.setValue('');
    this.membersTable.data.push(event?.option?.value ?? undefined);
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
}
