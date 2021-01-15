import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetOpusGiftHistorySelectedPlayerIdentities {
  public static readonly type = '[OpusGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}
