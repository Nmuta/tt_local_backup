import BigNumber from 'bignumber.js';

export enum EntitlementType {
  Purchased = 'Purchased',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

/** Interface for a player entitlement. */
export interface Entitlement {
  type: EntitlementType;
  dateId: number;
  xuid: BigNumber;
  orderId: string;
  purchasePriceUSDAmount: number;
  isPaidTransaction: boolean;
  productId: string;
  productTypeName: string;
  titleId: BigNumber;
}

/** Type for a purchased entitlement */
export type PurchasedEntitlement = Entitlement & {
  purchaseDateTimeUtc: string;
  purchaseQuantity: BigNumber;
  msrpUsdAmount: number;
  tokenRedemption: boolean;
  isFullProduct: boolean;
  isTrialProduct: boolean;
  isBetaProduct: boolean;
  isInGamePurchase: boolean;
  xboxProductId: string;
  productDisplayName: string;
  xboxParentProductId: string;
  skuDisplayName: string;
  skuTypeName: string;
  transactionTypeName: string;
  dataSourceName: string;
  storeClientName: string;
};

/** Type for a refunded entitlement */
export type RefundedEntitlement = Entitlement & {
  refundDateId: BigNumber;
  clientDeviceType: string;
  orderStateName: string;
  refundReasonCode: string;
};

/** Type for a cancelled entitlement */
export type CancelledEntitlement = Entitlement & {
  revokedDateId: BigNumber;
  clientDeviceType: string;
  orderStateName: string;
};
