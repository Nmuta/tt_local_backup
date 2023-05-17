import { Injectable } from '@angular/core';
import { LocalizedMessage } from '@models/community-message';
import { LocalizedPlayerNotification } from '@models/notifications.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/messages endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerMessagesService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotifications$(xuid: BigNumber): Observable<LocalizedPlayerNotification[]> {
    return this.api.getRequest$(`${this.basePath}/${xuid}/messages`);
  }

  /** Edits a player's localized message. */
  public postEditPlayerLocalizedMessage$(
    xuid: BigNumber,
    notificationId: string,
    localizedMessage: LocalizedMessage,
  ): Observable<void> {
    return this.api.postRequest$<void>(
      `${this.basePath}/${xuid}/messages/${notificationId}`,
      localizedMessage,
    );
  }

  /** Deletes a player's localized message. */
  public deletePlayerLocalizedMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
    return this.api.deleteRequest$<void>(`${this.basePath}/${xuid}/messages/${notificationId}`);
  }
}
