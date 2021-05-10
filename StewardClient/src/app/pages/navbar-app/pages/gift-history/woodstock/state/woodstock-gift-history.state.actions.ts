import { IdentityResultAlphaBatch } from '@models/identity-query.model';

/** Sets the gift history page's selected player identities. */
export class SetWoodstockGiftHistorySelectedPlayerIdentities {
  public static readonly type = '[WoodstockGiftHistory] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the woodstock page's selected mat tab. */
export class SetWoodstockGiftHistoryMatTabIndex {
  public static readonly type = '[WoodstockGiftHistory] Set Woodstock Gift History Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}
