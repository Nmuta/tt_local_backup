import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BasicPlayerActionResult } from '@models/basic-player';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { LspGroup } from '@models/lsp-group';
import {
  ForzaBulkOperationType,
  UserGroupBulkOperationStatus,
} from '@models/user-group-bulk-operation';
import { ApolloUserGroupService } from '@services/api-v2/apollo/user-group/apollo-user-group.service';
import BigNumber from 'bignumber.js';
import { first } from 'lodash';
import { map, Observable } from 'rxjs';
import { ListUsersInGroupServiceContract } from '../list-users-in-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'apollo-list-users-in-user-group',
  templateUrl: './apollo-list-users-in-user-group.component.html',
  styleUrls: ['./apollo-list-users-in-user-group.component.scss'],
})
export class ApolloListUsersInGroupComponent extends BaseComponent {
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;
  public service: ListUsersInGroupServiceContract;

  constructor(userGroupService: ApolloUserGroupService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM7,
      //Includes "All Users", "VIP"
      largeUserGroups: [new BigNumber(0), new BigNumber(1)],
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
      ): Observable<BasicPlayerActionResult> {
        return userGroupService
          .removeUsersFromGroup$(userGroup.id, playerList)
          .pipe(map(response => first(response)));
      },
      deleteAllPlayersFromUserGroup$(userGroup: LspGroup): Observable<void> {
        return userGroupService.removeAllUsersFromGroup$(userGroup.id);
      },
      deletePlayersFromUserGroupUsingBulkProcessing$(
        playerList: BasicPlayerList,
        userGroup: LspGroup,
      ): Observable<UserGroupBulkOperationStatus> {
        return userGroupService.removeUsersFromGroupUsingBulkProcessing$(userGroup.id, playerList);
      },
      addPlayersToUserGroupUsingBulkProcessing$(
        playerList: BasicPlayerList,
        userGroup: LspGroup,
      ): Observable<UserGroupBulkOperationStatus> {
        return userGroupService.addUsersToGroupUsingBulkProcessing$(userGroup.id, playerList);
      },
      getBulkOperationStatus$(
        _userGroup: LspGroup,
        _bulkOperationType: ForzaBulkOperationType,
        _bulkOperationId: string,
      ): Observable<UserGroupBulkOperationStatus> {
        throw new Error('GetBulkOperationStatus is not supported on Apollo.');
      },
    };
  }
}
