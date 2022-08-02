import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { LspGroup } from '@models/lsp-group';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import BigNumber from 'bignumber.js';
import { Observable, throwError } from 'rxjs';
import {
  ListUsersInGroupServiceContract,
  PlayerInUserGroup,
} from '../list-users-in-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'sunrise-list-users-in-user-group',
  templateUrl: './sunrise-list-users-in-user-group.component.html',
  styleUrls: ['./sunrise-list-users-in-user-group.component.scss'],
})
export class SunriseListUsersInGroupComponent extends BaseComponent {
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;
  public service: ListUsersInGroupServiceContract;

  constructor() {
    super();

    this.service = {
      getPlayersInUserGroup$(_userGroup: LspGroup): Observable<PlayerInUserGroup[]> {
        return throwError(
          () => new Error('Getting players in user group is currently unsupported.'),
        );
      },
      deletePlayerFromUserGroup$(
        _xuid: BigNumber,
        _userGroup: LspGroup,
      ): Observable<UserGroupManagementResponse[]> {
        return throwError(
          () => new Error('Deleting a player in a user group is currently unsupported.'),
        );
      },
      deleteAllPlayersFromUserGroup$(
        _userGroup: LspGroup,
      ): Observable<UserGroupManagementResponse[]> {
        return throwError(
          () => new Error('Deleting all players in a user group is currently unsupported.'),
        );
      },
      deletePlayersFromUserGroupUsingBackgroundTask$(
        _xuids: BigNumber[],
        _userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return throwError(
          () => new Error('Deleting players in a user group is currently unsupported.'),
        );
      },
      addPlayersToUserGroupUsingBackgroundTask$(
        _xuids: BigNumber[],
        _userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return throwError(
          () => new Error('Adding players in a user group is currently unsupported.'),
        );
      },
    };
  }
}
