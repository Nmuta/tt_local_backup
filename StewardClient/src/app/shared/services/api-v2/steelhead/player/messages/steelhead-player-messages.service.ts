import { Injectable } from '@angular/core';
import { CommunityMessage } from '@models/community-message';
import { PlayerNotification } from '@models/notifications.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerMessagesService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]> {
    return this.api.getRequest$(`${this.basePath}/${xuid}/messages`);
  }

  /** Edits a player's community message. */
  public postEditPlayerCommunityMessage$(
    xuid: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${xuid}/messages/${notificationId}`,
      communityMessage,
    );
  }

  /** Deletes a player's community message. */
  public deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
    return this.api.deleteRequest$<void>(`${this.basePath}/${xuid}/messages/${notificationId}`);
  }
}
