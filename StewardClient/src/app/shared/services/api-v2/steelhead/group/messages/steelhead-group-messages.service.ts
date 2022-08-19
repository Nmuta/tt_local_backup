import { Injectable } from '@angular/core';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { GroupNotification } from '@models/notifications.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadGroupMessagesService {
  public readonly basePath: string = 'title/steelhead/group';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the status of an LSP group's notifications. */
  public getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]> {
    return this.api.getRequest$(`${this.basePath}/${lspGroupId}/messages`);
  }

  /** Sends a community message. */
  public postSendCommunityMessageToLspGroup$(
    lspGroupId: BigNumber,
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>> {
    return this.api.postRequest$<CommunityMessageResult<BigNumber>>(
      `${this.basePath}/${lspGroupId}/messages`,
      communityMessage,
    );
  }

  /** Edits a group community message. */
  public postEditLspGroupCommunityMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${lspGroupId}/messages/${notificationId}`,
      communityMessage,
    );
  }

  /** Deletes a group community message. */
  public deleteLspGroupCommunityMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
  ): Observable<void> {
    return this.api.deleteRequest$<void>(
      `${this.basePath}/${lspGroupId}/messages/${notificationId}`,
    );
  }
}
