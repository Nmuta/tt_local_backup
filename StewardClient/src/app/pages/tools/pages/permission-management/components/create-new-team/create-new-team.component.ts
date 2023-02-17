import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BaseComponent } from '@components/base-component/base.component';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { UserService } from '@services/user';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { sortBy } from 'lodash';
import { map, Observable, startWith, takeUntil } from 'rxjs';
import { StewardTeam } from '../../permission-management.models';

/** Tools that creates a new Steward team. */
@Component({
  selector: 'create-new-team',
  templateUrl: './create-new-team.component.html',
  styleUrls: ['./create-new-team.component.scss'],
})
export class CreateNewTeamComponent extends BaseComponent implements OnInit {
  public getUsersActionMonitor = new ActionMonitor('GET all Steward users');
  public createTeamActionMonitor = new ActionMonitor('POST create new Steward team');

  public allUsers: UserModel[];
  public filteredUsers$: Observable<UserModel[]>;

  public formControls = {
    name: new FormControl('', Validators.required),
    filterLead: new FormControl(''),
    lead: new FormControl('', Validators.required),
  };
  public formGroup = new FormGroup(this.formControls);

  constructor(
    private readonly userService: UserService,
    private readonly v2UsersService: V2UsersService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getUsersActionMonitor = this.getUsersActionMonitor.repeat();
    this.userService
      .getAllStewardUsers$()
      .pipe(this.getUsersActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(users => {
        const generalUsers = users.filter(user => user.role === UserRole.GeneralUser);

        this.allUsers = sortBy(generalUsers, user => {
          return user.name;
        }) as UserModel[];
      });

    this.filteredUsers$ = this.formControls.filterLead.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  /** Creates a new Steward team. */
  public createStewardTeam(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const newTeam: StewardTeam = {
      name: this.formControls.name.value,
      teamLeadId: (this.formControls.lead.value as UserModel).objectId,
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

  /** The autocomplete text display function. */
  public autoCompleteDisplayFn(user: UserModel): string {
    if (!user) {
      return '';
    }

    return `${user.name} | ${user.emailAddress}`;
  }

  /** Action when user is selected from autocomplete */
  public onSelected(event: MatAutocompleteSelectedEvent): void {
    if (!event) {
      this.formControls.filterLead.setValue(null);
    }

    this.formControls.lead.setValue(event.option.value);
  }

  private _filter(value: string): UserModel[] {
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
}
