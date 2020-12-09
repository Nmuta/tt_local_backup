/** Sets the gifting page's selected player identities. */
export class SetSunriseSelectedPlayerIdentities {
  public static readonly type = '[SunriseGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: unknown[]) {}
}
