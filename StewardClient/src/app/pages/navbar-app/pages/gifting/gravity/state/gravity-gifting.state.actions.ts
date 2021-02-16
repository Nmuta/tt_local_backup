import { IdentityResultBetaBatch } from '@models/identity-query.model';
import { GiftBasketModel } from '@models/master-inventory-item';

/** Sets the gifting page's selected player identities. */
export class SetGravitySelectedPlayerIdentities {
  public static readonly type = '[GravityGifting] Set Selected Player Identities';
  constructor(public readonly selectedPlayerIdentities: IdentityResultBetaBatch) {}
}

/** Sets the gravity gift basket. */
export class SetGravityGiftBasket {
  public static readonly type = '[GravityGifting] Set Gravity Gift Basket';
  constructor(public readonly giftBasket: GiftBasketModel[]) {}
}
