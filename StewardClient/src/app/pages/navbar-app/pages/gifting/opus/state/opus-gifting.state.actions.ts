/** Sets the gifting page's selected player identities. */
export class SetOpusSelectedPlayerIdentities {
  public static readonly type = '[OpusGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: unknown[]) {}
}
