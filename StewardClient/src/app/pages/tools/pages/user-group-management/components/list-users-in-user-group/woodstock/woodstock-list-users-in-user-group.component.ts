import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { LspGroup } from '@models/lsp-group';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { WoodstockUserGroupService } from '@services/api-v2/woodstock/user-group/woodstock-user-group.service';
import BigNumber from 'bignumber.js';
import { Observable, throwError } from 'rxjs';
import {
  ListUsersInGroupServiceContract,
  PlayerInUserGroup,
} from '../list-users-in-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'woodstock-list-users-in-user-group',
  templateUrl: './woodstock-list-users-in-user-group.component.html',
  styleUrls: ['./woodstock-list-users-in-user-group.component.scss'],
})
export class WoodstockListUsersInGroupComponent extends BaseComponent {
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;
  public service: ListUsersInGroupServiceContract;

  constructor(userGroupService: WoodstockUserGroupService) {
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
        return userGroupService.removeUsersFromGroup$(_userGroup.id, [_xuid]);
      },
      deleteAllPlayersFromUserGroup$(
        _userGroup: LspGroup,
      ): Observable<UserGroupManagementResponse[]> {
        //Todo
        return throwError(
          () => new Error('Deleting all players in a user group is currently unsupported.'),
        );
      },
      deletePlayersFromUserGroupUsingBackgroundTask$(
        xuids: BigNumber[],
        userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return userGroupService.removeUsersFromGroupUsingBackgroundTask$(userGroup.id, xuids);
      },
      addPlayersToUserGroupUsingBackgroundTask$(
        xuids: BigNumber[],
        userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return userGroupService.addUsersToGroupUsingBackgroundTask$(userGroup.id, xuids);
      },
    };
  }
}
