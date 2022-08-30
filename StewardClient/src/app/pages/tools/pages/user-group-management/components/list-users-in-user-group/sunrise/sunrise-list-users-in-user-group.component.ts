import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { LspGroup } from '@models/lsp-group';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { Observable, throwError } from 'rxjs';
import { ListUsersInGroupServiceContract } from '../list-users-in-user-group.component';

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
      gameTitle: GameTitle.FH4,
      getPlayersInUserGroup$(
        _userGroup: LspGroup,
        _startIndex: number,
        _maxResults: number,
      ): Observable<GetUserGroupUsersResponse> {
        return throwError(
          () => new Error('Getting players in user group is currently unsupported.'),
        );
      },
      deletePlayerFromUserGroup$(
        _playerList: BasicPlayerList,
        _userGroup: LspGroup,
      ): Observable<UserGroupManagementResponse[]> {
        return throwError(
          () => new Error('Deleting a player in a user group is currently unsupported.'),
        );
      },
      deleteAllPlayersFromUserGroup$(_userGroup: LspGroup): Observable<void> {
        return throwError(
          () => new Error('Deleting all players in a user group is currently unsupported.'),
        );
      },
      deletePlayersFromUserGroupUsingBackgroundTask$(
        _playerList: BasicPlayerList,
        _userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return throwError(
          () => new Error('Deleting players in a user group is currently unsupported.'),
        );
      },
      addPlayersToUserGroupUsingBackgroundTask$(
        _playerList: BasicPlayerList,
        _userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return throwError(
          () => new Error('Adding players in a user group is currently unsupported.'),
        );
      },
    };
  }
}
