/** Sets the gifting page's selected player identities. */
export class SetGravitySelectedPlayerIdentities {
  public static readonly type = '[GravityGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: unknown[]) {}
}
