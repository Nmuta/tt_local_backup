import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { GiftBasketModel } from '@models/master-inventory-item';

/** Sets the gifting page's selected player identities. */
export class SetSunriseGiftingSelectedPlayerIdentities {
  public static readonly type = '[SunriseGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the gifting page's selected player identities. */
export class SetSunriseGiftingMatTabIndex {
  public static readonly type = '[SunriseGifting] Set SUnrise Gifting Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}

/** Sets the sunrise gift basket. */
export class SetSunriseGiftBasket {
  public static readonly type = '[SunriseGifting] Set Sunrise Gift Basket';
  constructor(public readonly giftBasket: GiftBasketModel[]) {}
}
