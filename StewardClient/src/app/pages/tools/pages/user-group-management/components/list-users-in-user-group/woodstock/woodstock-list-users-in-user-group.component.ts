import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { BasicPlayerAction } from '@models/basic-player';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { LspGroup } from '@models/lsp-group';
import { WoodstockUserGroupService } from '@services/api-v2/woodstock/user-group/woodstock-user-group.service';
import { first } from 'lodash';
import { map, Observable } from 'rxjs';
import { ListUsersInGroupServiceContract } from '../list-users-in-user-group.component';

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
      gameTitle: GameTitle.FH5,
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
      ): Observable<BasicPlayerAction> {
        return userGroupService
          .removeUsersFromGroup$(userGroup.id, playerList)
          .pipe(map(response => first(response)));
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
