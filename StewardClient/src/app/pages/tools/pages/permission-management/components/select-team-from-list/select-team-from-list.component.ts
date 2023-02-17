import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BaseComponent } from '@components/base-component/base.component';
import { UserRole } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { UserModel } from '@models/user.model';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { find, keys, sortBy } from 'lodash';
import { combineLatest, map, Observable, startWith, takeUntil } from 'rxjs';
import { StewardTeam } from '../../permission-management.models';

/** Tools that creates a new Steward team. */
@Component({
  selector: 'select-team-from-list',
  templateUrl: './select-team-from-list.component.html',
  styleUrls: ['./select-team-from-list.component.scss'],
})
export class SelectTeamFromListComponent extends BaseComponent implements OnInit {
  /** Outputs when the select team changes */
  @Output() public selectedTeamChange = new EventEmitter<StewardTeam>();

  public initComponentActionMonitor = new ActionMonitor('GET all Steward users');
  public createTeamActionMonitor = new ActionMonitor('POST create new Steward team');

  public allUsers: UserModel[];
  public filteredUsers$: Observable<UserModel[]>;
  public allTeams: StewardTeam[];
  public filteredTeams$: Observable<StewardTeam[]>;

  public formControls = {
    name: new FormControl('', Validators.required),
    filterLead: new FormControl(''),
    lead: new FormControl('', Validators.required),
  };
  public formGroup = new FormGroup(this.formControls);

  public teamFormControl = new FormControl('');

  constructor(
    private readonly userService: UserService,
    private readonly v2UsersService: V2UsersService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.initComponentActionMonitor = this.initComponentActionMonitor.repeat();

    const getUsers$ = this.getStewardUsers$();
    const getTeams$ = this.getStewardTeams$();

    combineLatest([getUsers$, getTeams$])
      .pipe(this.initComponentActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([users, teams]) => {
        const generalUsers = users.filter(user => user.role === UserRole.GeneralUser);

        this.allUsers = sortBy(generalUsers, user => {
          return user.name;
        }) as UserModel[];

        this.allTeams = keys(teams).map(teamLeadId => {
          const team = teams[teamLeadId];
          const teamLead = find(users, user => user.objectId === teamLeadId);

          return {
            name: team.name,
            members: team.members,
            teamLead: teamLead,
          } as StewardTeam;
        });
      });

    this.filteredUsers$ = this.formControls.filterLead.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || '')),
    );

    this.filteredTeams$ = this.teamFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTeams(value || '')),
    );
  }

  /** Creates a new Steward team. */
  public createStewardTeam(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const newTeam: StewardTeam = {
      name: this.formControls.name.value,
      teamLead: this.formControls.lead.value as UserModel,
      members: [],
    };

    this.createTeamActionMonitor = this.createTeamActionMonitor.repeat();
    this.v2UsersService
      .createNewStewardTeam$(newTeam)
      .pipe(this.createTeamActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.formControls.name.setValue('');
        this.formControls.filterLead.setValue('');
        this.formControls.lead.setValue('');
        // Reload team list
      });
  }

  /** The autocomplete text display function for user list. */
  public userAutoCompleteDisplayFn(user: UserModel): string {
    if (!user) {
      return '';
    }

    return `${user.name} | ${user.emailAddress}`;
  }

  /** The autocomplete text display function for user list. */
  public teamAutoCompleteDisplayFn(team: StewardTeam): string {
    if (!team) {
      return '';
    }

    return `${team.name} | ${team?.teamLead?.name ?? 'Unknown lead'}`;
  }

  /** Action when user is selected from autocomplete */
  public onUserSelected(event: MatAutocompleteSelectedEvent): void {
    if (!event) {
      this.formControls.filterLead.setValue(null);
    }

    this.formControls.lead.setValue(event.option.value);
  }

  /** Action when team is selected from autocomplete */
  public onTeamSelected(event: MatAutocompleteSelectedEvent): void {
    if (!event) {
      this.teamFormControl.setValue(null);
    }

    const selectedTeam = event?.option?.value ?? null;
    this.teamFormControl.setValue(selectedTeam);
    this.selectedTeamChange.emit(selectedTeam);
  }

  private getStewardUsers$(): Observable<UserModel[]> {
    return this.userService.getAllStewardUsers$();
  }

  private getStewardTeams$(): Observable<Map<GuidLikeString, StewardTeam>> {
    return this.v2UsersService.getStewardTeams$();
  }

  private _filterUsers(value: string): UserModel[] {
    if (!value || typeof value !== 'string') {
      return this.allUsers;
    }

    const filterValue = value.toLowerCase();
    return this.allUsers.filter(
      user =>
        user.name.toLowerCase().includes(filterValue) ||
        user.emailAddress.toLowerCase().includes(filterValue) ||
        user.objectId.toLowerCase().includes(filterValue),
    );
  }

  private _filterTeams(value: string): StewardTeam[] {
    if (!value || typeof value !== 'string') {
      return this.allTeams;
    }

    const filterValue = value.toLowerCase();
    return this.allTeams.filter(
      team =>
        team.name.toLowerCase().includes(filterValue) ||
        team.teamLead.emailAddress.toLowerCase().includes(filterValue) ||
        team.teamLead.objectId.toLowerCase().includes(filterValue),
    );
  }
}
