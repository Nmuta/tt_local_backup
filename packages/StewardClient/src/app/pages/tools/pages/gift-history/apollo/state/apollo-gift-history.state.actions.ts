import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetApolloGiftHistorySelectedPlayerIdentities {
  public static readonly type = '[ApolloGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the apollo page's selected mat tab. */
export class SetApolloGiftHistoryMatTabIndex {
  public static readonly type = '[ApolloGiftHistory] Set Apollo Gift History Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}
