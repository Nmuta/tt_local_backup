import { IdentityResultBetaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetGravitySelectedPlayerIdentities {
  public static readonly type = '[GravityGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultBetaBatch) {}
}
