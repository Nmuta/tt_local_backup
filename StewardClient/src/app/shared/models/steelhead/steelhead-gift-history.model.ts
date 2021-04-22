import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { SteelheadGift } from './steelhead-gift.model';

/** Interface for Steelhead gift history. */
export interface SteelheadGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'Steelhead';
  giftSendDateUtc: Date;
  giftInventory: SteelheadGift;
  requestingAgent: string;
}
