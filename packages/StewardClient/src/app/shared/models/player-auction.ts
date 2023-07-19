import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { AuctionStatus } from './auction-filters';

/** Interface for a player auction. */
export interface PlayerAuction {
  id: string;
  itemName: string;
  makeId: BigNumber;
  modelId: BigNumber;
  status: AuctionStatus;
  createdDateUtc: Date;
  closingDateUtc: Date;
  currentPrice: BigNumber;
  buyoutPrice: BigNumber;
  bids: BigNumber;
  liveryImageBase64: string;
  textureMapImageBase64: string;
  reviewState: BigNumber;
  totalReports: BigNumber;
  timeFlagged: DateTime;
}
