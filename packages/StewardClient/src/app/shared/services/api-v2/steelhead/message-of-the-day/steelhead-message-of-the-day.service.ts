import { Injectable } from '@angular/core';
import { PullRequest } from '@models/git-operation';
import { MessageOfTheDay, FriendlyNameMap } from '@models/message-of-the-day';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/messageoftheday endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadMessageOfTheDayService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/messageoftheday';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Message of the Day Friendly Name list mapped to Guid. */
  public getMessagesOfTheDay$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/options`);
  }

  /** Gets Message of the Day detail. */
  public getMessageOfTheDayDetail$(motdId: string): Observable<MessageOfTheDay> {
    return this.api.getRequest$<MessageOfTheDay>(`${this.basePath}/${motdId}`);
  }

  /** Submit Message of the Day modification. */
  public submitModification$(motdId: string, motd: MessageOfTheDay): Observable<PullRequest> {
    return this.api.postRequest$<PullRequest>(`${this.basePath}/${motdId}`, motd);
  }
}
