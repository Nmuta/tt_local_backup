import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';

/** Sets the gifting page's selected player identities. */
export class SetSteelheadGiftingSelectedPlayerIdentities {
  public static readonly type = '[SteelheadGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the steelhead page's selected mat tab. */
export class SetSteelheadGiftingMatTabIndex {
  public static readonly type = '[SteelheadGifting] Set Steelhead Gifting Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}

/** Sets the steelhead gift basket. */
export class SetSteelheadGiftBasket {
  public static readonly type = '[SteelheadGifting] Set Steelhead Gift Basket';
  constructor(public readonly giftBasket: GiftBasketModel[]) {}
}
