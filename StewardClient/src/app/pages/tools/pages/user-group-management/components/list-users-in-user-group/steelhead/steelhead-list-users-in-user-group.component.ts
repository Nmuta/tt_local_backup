import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { LspGroup } from '@models/lsp-group';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { SteelheadUserGroupService } from '@services/api-v2/steelhead/user-group/steelhead-user-group.service';
import { Observable } from 'rxjs';
import { ListUsersInGroupServiceContract } from '../list-users-in-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'steelhead-list-users-in-user-group',
  templateUrl: './steelhead-list-users-in-user-group.component.html',
  styleUrls: ['./steelhead-list-users-in-user-group.component.scss'],
})
export class SteelheadListUsersInGroupComponent extends BaseComponent {
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;
  public service: ListUsersInGroupServiceContract;

  constructor(userGroupService: SteelheadUserGroupService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayersInUserGroup$(
        userGroup: LspGroup,
        startIndex: number,
        maxResults: number,
      ): Observable<GetUserGroupUsersResponse> {
        return userGroupService.getUserGroupUsers$(userGroup.id, startIndex, maxResults);
      },
      deletePlayerFromUserGroup$(
        playerList: BasicPlayerList,
        userGroup: LspGroup,
      ): Observable<UserGroupManagementResponse[]> {
        return userGroupService.removeUsersFromGroup$(userGroup.id, playerList);
      },
      deleteAllPlayersFromUserGroup$(userGroup: LspGroup): Observable<void> {
        return userGroupService.removeAllUsersFromGroup$(userGroup.id);
      },
      deletePlayersFromUserGroupUsingBackgroundTask$(
        playerList: BasicPlayerList,
        userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return userGroupService.removeUsersFromGroupUsingBackgroundTask$(userGroup.id, playerList);
      },
      addPlayersToUserGroupUsingBackgroundTask$(
        playerList: BasicPlayerList,
        userGroup: LspGroup,
      ): Observable<BackgroundJob<void>> {
        return userGroupService.addUsersToGroupUsingBackgroundTask$(userGroup.id, playerList);
      },
    };
  }
}
