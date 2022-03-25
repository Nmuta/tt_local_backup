import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { UGCType } from './ugc-filters';

/** Interface for a player UGC item. */
export interface PlayerUGCItem {
  id: string;
  guidId: string;
  type: UGCType;
  gameTitle: BigNumber;
  owner: BigNumber;
  popularityBucket: BigNumber;
  thumbnailImageOneBase64: string;
  thumbnailImageTwoBase64: string;
  keywordIdOne: BigNumber;
  keywordIdTwo: BigNumber;
  carDescription: string;
  makeId: BigNumber;
  carId: BigNumber;
  reportingState: BigNumber;
  searchable: boolean;
  forceFeaturedEndDateUtc: DateTime;
  featuredEndDateUtc: DateTime;
  featuredByT10: boolean;
  title: string;
  description: string;
  createdDateUtc: DateTime;
  shareCode: string;
  timesDisliked: BigNumber;
  timesUsed: BigNumber;
  timesLiked: BigNumber;
  timesDownloaded: BigNumber;
  isPublic: boolean;
}

/** Creates a fake player UGC item */
export function fakePlayerUGCItem(): PlayerUGCItem {
  const id = faker.datatype.uuid();
  return {
    id: faker.datatype.uuid(),
    guidId: id.toString(),
    type: UGCType.Livery,
    gameTitle: new BigNumber(0),
    owner: fakeBigNumber(),
    popularityBucket: new BigNumber(0),
    thumbnailImageOneBase64: faker.image.imageUrl(),
    thumbnailImageTwoBase64: faker.image.imageUrl(),
    keywordIdOne: new BigNumber(0),
    keywordIdTwo: new BigNumber(0),
    carDescription: faker.random.words(10),
    makeId: new BigNumber(0),
    carId: new BigNumber(0),
    reportingState: new BigNumber(0),
    searchable: true,
    forceFeaturedEndDateUtc: null,
    featuredEndDateUtc: null,
    featuredByT10: false,
    title: faker.random.word(),
    description: faker.random.words(10),
    createdDateUtc: null,
    shareCode: faker.random.word(),
    timesDisliked: new BigNumber(0),
    timesUsed: new BigNumber(0),
    timesLiked: new BigNumber(0),
    timesDownloaded: new BigNumber(0),
    isPublic: true,
  };
}
