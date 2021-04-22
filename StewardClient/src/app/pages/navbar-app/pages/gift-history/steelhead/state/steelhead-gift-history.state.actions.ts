import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetSteelheadGiftHistorySelectedPlayerIdentities {
  public static readonly type = '[SteelheadGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the apollo page's selected mat tab. */
export class SetSteelheadGiftHistoryMatTabIndex {
  public static readonly type = '[SteelheadGiftHistory] Set Steelhead Gift History Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}
