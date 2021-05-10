import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { WoodstockGift } from './woodstock-gift.model';

/** Interface for Woodstock gift history. */
export interface WoodstockGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'woodstock';
  giftSendDateUtc: Date;
  giftInventory: WoodstockGift;
  requestingAgent: string;
}
