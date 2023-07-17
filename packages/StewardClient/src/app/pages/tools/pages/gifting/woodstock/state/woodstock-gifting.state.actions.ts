import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { GiftBasketModel } from '../../components/gift-basket/gift-basket.base.component';

/** Sets the gifting page's selected player identities. */
export class SetWoodstockGiftingSelectedPlayerIdentities {
  public static readonly type = '[WoodstockGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultAlphaBatch) {}
}

/** Sets the gifting page's selected player identities. */
export class SetWoodstockGiftingMatTabIndex {
  public static readonly type = '[WoodstockGifting] Set Woodstock Gifting Mat TabIndex';
  constructor(public readonly selectedMatIndex: number) {}
}

/** Sets the woodstock gift basket. */
export class SetWoodstockGiftBasket {
  public static readonly type = '[WoodstockGifting] Set Woodstock Gift Basket';
  constructor(public readonly giftBasket: GiftBasketModel[]) {}
}
