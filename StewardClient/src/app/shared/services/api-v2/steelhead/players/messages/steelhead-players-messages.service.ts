import { Injectable } from '@angular/core';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayersMessagesService {
  public readonly basePath: string = 'title/steelhead/players/messages';
  constructor(private readonly api: ApiV2Service) {}

  /** Sends a community message. */
  public postSendCommunityMessageToXuids$(
    xuids: BigNumber[],
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>[]> {
    const bulkMessage = communityMessage as BulkCommunityMessage;
    bulkMessage.xuids = xuids;

    return this.api.postRequest$<CommunityMessageResult<BigNumber>[]>(
      `${this.basePath}`,
      bulkMessage,
    );
  }
}
