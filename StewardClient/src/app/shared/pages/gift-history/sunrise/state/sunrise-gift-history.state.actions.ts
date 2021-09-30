import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetSunriseGiftHistorySelectedPlayerIdentities {
  public static readonly type = '[SunriseGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the sunrise page's selected mat tab. */
export class SetSunriseGiftHistoryMatTabIndex {
  public static readonly type = '[SunriseGiftHistory] Set Sunrise Gift History Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}
