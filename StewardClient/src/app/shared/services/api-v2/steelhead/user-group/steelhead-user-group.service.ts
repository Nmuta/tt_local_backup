import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';
import { BasicPlayerList } from '@models/basic-player-list';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { HttpParams } from '@angular/common/http';
import { BasicPlayerActionResult } from '@models/basic-player';
import {
  ForzaBulkOperationType,
  UserGroupBulkOperationStatus,
} from '@models/user-group-bulk-operation';

/** The /v2/steelhead/usergroup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUserGroupService {
  private basePath: string = 'title/steelhead/usergroup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Steelhead lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.api.getRequest$<LspGroups>(`${this.basePath}`);
  }

  /** Gets users for a user group. Index starts at 1. */
  public getUserGroupUsers$(
    userGroupId: BigNumber,
    startIndex: number,
    maxResults: number,
  ): Observable<GetUserGroupUsersResponse> {
    const httpParams: HttpParams = new HttpParams()
      .append('startIndex', startIndex.toString())
      .append('maxResults', maxResults.toString());

    return this.api.getRequest$<GetUserGroupUsersResponse>(
      `${this.basePath}/${userGroupId}`,
      httpParams,
    );
  }

  /** Create user group. */
  public createUserGroup$(userGroupName: string): Observable<LspGroup> {
    return this.api.postRequest$<LspGroup>(`${this.basePath}/${userGroupName}`, undefined);
  }

  /** Remove users from a user group. */
  public removeUsersFromGroup$(
    userGroupId: BigNumber,
    playerList: BasicPlayerList,
  ): Observable<BasicPlayerActionResult[]> {
    const params = new HttpParams().set('useBulkProcessing', false);

    return this.api.postRequest$<BasicPlayerActionResult[]>(
      `${this.basePath}/${userGroupId}/remove`,
      playerList,
      params,
    );
  }

  /** Remove users from a user group using the bulk processing. */
  public removeUsersFromGroupUsingBulkProcessing$(
    userGroupId: BigNumber,
    playerList: BasicPlayerList,
  ): Observable<UserGroupBulkOperationStatus> {
    const params = new HttpParams().set('useBulkProcessing', true);

    return this.api.postRequest$<UserGroupBulkOperationStatus>(
      `${this.basePath}/${userGroupId}/remove`,
      playerList,
      params,
    );
  }

  /** Add users to a user group using the bulk processing. */
  public addUsersToGroupUsingBulkProcessing$(
    userGroupId: BigNumber,
    playerList: BasicPlayerList,
  ): Observable<UserGroupBulkOperationStatus> {
    const params = new HttpParams().set('useBulkProcessing', true);

    return this.api.postRequest$<UserGroupBulkOperationStatus>(
      `${this.basePath}/${userGroupId}/add`,
      playerList,
      params,
    );
  }

  /** Get bulk operation status. */
  public getBulkOperationStatus$(
    userGroupId: BigNumber,
    operationId: string,
    bulkOperationType: ForzaBulkOperationType,
  ): Observable<UserGroupBulkOperationStatus> {
    const httpParams: HttpParams = new HttpParams().append(
      'bulkOperationType',
      bulkOperationType.toString(),
    );

    return this.api.getRequest$<UserGroupBulkOperationStatus>(
      `${this.basePath}/${userGroupId}/bulkOperationStatus/${operationId}`,
      httpParams,
    );
  }

  /** Remove every users from a user group. */
  public removeAllUsersFromGroup$(userGroupId: BigNumber): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${userGroupId}/removeAllUsers`, undefined);
  }
}
