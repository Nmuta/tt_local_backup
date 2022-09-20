import { Injectable } from '@angular/core';
import {
  BulkLocalizedMessage,
  CommunityMessageResult,
  LocalizedMessage,
} from '@models/community-message';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/players/messages endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayersMessagesService {
  public readonly basePath: string = 'title/steelhead/players/messages';
  constructor(private readonly api: ApiV2Service) {}

  /** Sends a localized message. */
  public postSendLocalizedMessageToXuids$(
    xuids: BigNumber[],
    localizedMessage: LocalizedMessage,
  ): Observable<CommunityMessageResult<BigNumber>[]> {
    const bulkMessage = localizedMessage as BulkLocalizedMessage;
    bulkMessage.xuids = xuids;

    return this.api.postRequest$<CommunityMessageResult<BigNumber>[]>(
      `${this.basePath}`,
      bulkMessage,
    );
  }
}
