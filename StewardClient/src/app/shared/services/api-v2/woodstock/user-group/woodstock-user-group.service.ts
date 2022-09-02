import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { BackgroundJob } from '@models/background-job';
import { BasicPlayerList } from '@models/basic-player-list';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { HttpParams } from '@angular/common/http';

/** The /v2/woodstock/usergroup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUserGroupService {
  private basePath: string = 'title/woodstock/usergroup';
  constructor(private readonly api: ApiV2Service) {}

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
  ): Observable<UserGroupManagementResponse[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);

    return this.api.postRequest$<UserGroupManagementResponse[]>(
      `${this.basePath}/${userGroupId}/remove`,
      playerList,
      params,
    );
  }

  /** Remove users from a user group using a background job. */
  public removeUsersFromGroupUsingBackgroundTask$(
    userGroupId: BigNumber,
    playerList: BasicPlayerList,
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);

    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/${userGroupId}/remove`,
      playerList,
      params,
    );
  }

  /** Add users to a user group using a background job. */
  public addUsersToGroupUsingBackgroundTask$(
    userGroupId: BigNumber,
    playerList: BasicPlayerList,
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);

    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/${userGroupId}/add`,
      playerList,
      params,
    );
  }

  /** Remove every users from a user group. */
  public removeAllUsersFromGroup$(userGroupId: BigNumber): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${userGroupId}/removeAllUsers`, undefined);
  }
}
