import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
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

/** Creates a fake player UGC item */
export function fakePlayerUGCItem(): PlayerUGCItem {
  const id = faker.datatype.uuid();
  return {
    id: faker.datatype.uuid(),
    guidId: id.toString(),
    type: UGCType.Livery,
    gameTitle: 0,
    owner: fakeBigNumber(),
    popularityBucket: 0,
    thumbnailImageOneBase64: faker.image.imageUrl(),
    thumbnailImageTwoBase64: faker.image.imageUrl(),
    keywordIdOne: 0,
    keywordIdTwo: 0,
    carDescription: faker.random.words(10),
    makeId: 0,
    carId: 0,
    reportingState: 0,
    searchable: true,
    forceFeaturedEndDateUtc: null,
    featuredEndDateUtc: null,
    featuredByT10: false,
    title: faker.random.word(),
    description: faker.random.words(10),
    createdDateUtc: null,
    shareCode: faker.random.word(),
    timesDisliked: 0,
    timesUsed: 0,
    timesLiked: 0,
    timesDownloaded: 0,
  };
}
