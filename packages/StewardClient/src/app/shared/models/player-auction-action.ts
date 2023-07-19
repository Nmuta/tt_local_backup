import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { GuidLikeString } from './extended-types';

/** Interface for a player's auction actions. */
export interface PlayerAuctionAction {
  timeUtc: DateTime;
  action: string;
  auctionId: string;
  id: GuidLikeString;
  xuid: BigNumber;
  isSuccess: boolean;
  errorMessage: string;
  sellerXuid: BigNumber;
  carId: BigNumber;
  carMake: BigNumber;
  carYear: BigNumber;
  carVin: string;
  bidAmount: BigNumber;
  spendAmount: BigNumber;
  openingPrice: BigNumber;
  buyoutPrice: BigNumber;
}
