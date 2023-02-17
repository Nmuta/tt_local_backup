import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { StewardTeam } from '../../permission-management.models';

/** Displays the Steward teams permission management tool. */
@Component({
  templateUrl: './team-permission-management.component.html',
  styleUrls: ['./team-permission-management.component.scss'],
})
export class TeamPermissionManagementComponent extends BaseComponent {
  public selectedTeam: StewardTeam;

  /** Logic when a new team is selected. */
  public selectedTeamChange(team: StewardTeam): void {
    this.selectedTeam = team;
  }
}
