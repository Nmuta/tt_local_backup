/** Sets the gifting page's selected player identities. */
export class SetApolloSelectedPlayerIdentities {
  public static readonly type = '[ApolloGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: unknown[]) {}
}
