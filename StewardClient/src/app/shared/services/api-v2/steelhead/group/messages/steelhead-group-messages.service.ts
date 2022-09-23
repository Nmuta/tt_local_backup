import { Injectable } from '@angular/core';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
import { GroupNotification } from '@models/notifications.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/group/{groupId}/messages endpoints. */
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

  /** Sends a localized message. */
  public postSendLocalizedMessageToLspGroup$(
    lspGroupId: BigNumber,
    localizedMessage: LocalizedMessage,
  ): Observable<CommunityMessageResult<BigNumber>> {
    return this.api.postRequest$<CommunityMessageResult<BigNumber>>(
      `${this.basePath}/${lspGroupId}/messages`,
      localizedMessage,
    );
  }

  /** Edits a group localized message. */
  public postEditLspGroupLocalizedMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
    localizedMessage: LocalizedMessage,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${lspGroupId}/messages/${notificationId}`,
      localizedMessage,
    );
  }

  /** Deletes a group localized message. */
  public deleteLspGroupLocalizedMessage$(
    lspGroupId: BigNumber,
    notificationId: string,
  ): Observable<void> {
    return this.api.deleteRequest$<void>(
      `${this.basePath}/${lspGroupId}/messages/${notificationId}`,
    );
  }
}
