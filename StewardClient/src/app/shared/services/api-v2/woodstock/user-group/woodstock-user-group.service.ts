import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import { LspGroup } from '@models/lsp-group';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { BackgroundJob } from '@models/background-job';

/** The /v2/woodstock/usergroup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUserGroupService {
  private basePath: string = 'title/woodstock/usergroup';
  constructor(private readonly api: ApiV2Service) {}

  /** Create user group. */
  public createUserGroup$(userGroupName: string): Observable<LspGroup> {
    return this.api.postRequest$<LspGroup>(`${this.basePath}/${userGroupName}`, undefined);
  }

  /** Remove users from a user group. */
  public removeUsersFromGroup$(
    userGroupId: BigNumber,
    xuids: BigNumber[],
  ): Observable<UserGroupManagementResponse[]> {
    return this.api.postRequest$<UserGroupManagementResponse[]>(
      `${this.basePath}/${userGroupId}/remove`,
      xuids,
    );
  }

  /** Add users to a user group. */
  public addUsersToGroupUsingBackgroundTask$(
    userGroupId: BigNumber,
    xuids: BigNumber[],
  ): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/${userGroupId}/add/useBackgroundProcessing`,
      xuids,
    );
  }

  /** Remove users from a user group. */
  public removeUsersFromGroupUsingBackgroundTask$(
    userGroupId: BigNumber,
    xuids: BigNumber[],
  ): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/${userGroupId}/remove/useBackgroundProcessing`,
      xuids,
    );
  }
}
