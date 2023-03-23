import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { UgcType } from './ugc-filters';

/** Interface for a player UGC item. */
export interface PlayerUgcItem {
  id: string;
  type: UgcType;
  gameTitle: BigNumber;
  ownerXuid: BigNumber;
  popularityBucket: BigNumber;
  thumbnailOneImageBase64: string;
  thumbnailTwoImageBase64: string;
  keywordIdOne: BigNumber;
  keywordIdTwo: BigNumber;
  carDescription: string;
  makeId: BigNumber;
  carId: BigNumber;
  reportingState: BigNumber;
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

  /** Only for livery type UGC items.  */
  liveryDownloadDataBase64?: string;
}

/** Geoflags that are valid in Woodstock. */
export enum WoodstockGeoFlags {
  China = 'China',
  Australia = 'Australia',
}

/** A UGC Item for woodstock players, which includes Woodstock-specific features. */
export interface WoodstockPlayerUgcItem extends PlayerUgcItem {
  /** Only for Woodstock / supported titles. */
  geoFlags: WoodstockGeoFlags[];
}

/** The result of a cloning operation. */
export interface ClonedItemResult {
  clonedFileId: string;
  clonedShareCode: string;
}

/** The result of a persisting operation. */
export interface PersistedItemResult {
  newFileId: string;
}

/** The result of a ugc operation (Cloning, persisting) */
export interface UgcOperationResult {
  fileId: string;
  shareCode?: string;
}

/** Creates a fake player UGC item */
export function fakePlayerUgcItem(): PlayerUgcItem {
  const id = faker.datatype.uuid();
  return {
    id: id.toString(),
    type: UgcType.Livery,
    gameTitle: new BigNumber(0),
    ownerXuid: fakeBigNumber(),
    popularityBucket: new BigNumber(0),
    thumbnailOneImageBase64: faker.image.imageUrl(),
    thumbnailTwoImageBase64: faker.image.imageUrl(),
    keywordIdOne: new BigNumber(0),
    keywordIdTwo: new BigNumber(0),
    carDescription: faker.random.words(10),
    makeId: new BigNumber(0),
    carId: new BigNumber(0),
    reportingState: new BigNumber(0),
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
