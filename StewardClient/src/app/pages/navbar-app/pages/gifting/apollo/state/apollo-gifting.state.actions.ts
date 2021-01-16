import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gifting page's selected player identities. */
export class SetApolloGiftingSelectedPlayerIdentities {
  public static readonly type = '[ApolloGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the apollo page's selected mat tab. */
export class SetApolloGiftingMatTabIndex {
  public static readonly type = '[ApolloGifting] Set Apollo Gifting Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}
