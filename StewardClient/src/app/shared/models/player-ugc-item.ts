import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { UGCType } from './ugc-filters';

/** Interface for a player UGC item. */
export interface PlayerUGCItem {
  id: string;
  guidId: string;
  type: UGCType;
  gameTitle: number;
  owner: BigNumber;
  popularityBucket: number;
  thumbnailImageOneBase64: string;
  thumbnailImageTwoBase64: string;
  keywordIdOne: number;
  keywordIdTwo: number;
  carDescription: string;
  makeId: number;
  carId: number;
  reportingState: number;
  searchable: boolean;
  forceFeaturedEndDateUtc: DateTime;
  featuredEndDateUtc: DateTime;
  featuredByT10: boolean;
  title: string;
  description: string;
  createdDateUtc: DateTime;
  shareCode: string;
  timesDisliked: number;
  timesUsed: number;
  timesLiked: number;
  timesDownloaded: number;
}
