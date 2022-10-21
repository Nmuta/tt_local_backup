import BigNumber from 'bignumber.js';

/** Filters used to modify UGC results. */
export interface UgcFilters {
  carId: BigNumber;
  makeId: BigNumber;
  keyword: string;
  accessLevel: UgcAccessLevel;
  orderBy: UgcOrderBy;
}

/** Filters used to modify UGC lookup. */
export interface UgcSearchFilters {
  xuid: BigNumber;
  ugcType: UgcType;
  carId: BigNumber;
  keywords: string;
  isFeatured: boolean;
}

/** Access level of UGC. */
export enum UgcAccessLevel {
  Any = 'Any',
  Public = 'Public',
  Private = 'Private',
}

/** Type of UGC. */
export enum UgcType {
  Unknown = 'Unknown',
  Livery = 'Livery',
  Photo = 'Photo',
  Tune = 'Tune',
  EventBlueprint = 'EventBlueprint',
  CommunityChallenge = 'CommunityChallenge',
}

/** Order to display UGC results. */
export enum UgcOrderBy {
  CreatedDateDesc = 'CreatedDateDesc',
  CreatedDateAsc = 'CreatedDateAsc',
  PopularityScoreDesc = 'PopularityScoreDesc',
  PopularityScoreAsc = 'PopularityScoreAsc',
}

/** Default values for UgcFilters. */
export const DefaultUgcFilters: UgcFilters = {
  makeId: undefined,
  carId: undefined,
  keyword: null,
  accessLevel: UgcAccessLevel.Any,
  orderBy: UgcOrderBy.CreatedDateDesc,
};

/** Default values for UgcFilters. */
export const WoodstockSupportedUgcTypes = [
  UgcType.Livery,
  UgcType.Photo,
  UgcType.Tune,
  UgcType.EventBlueprint,
  UgcType.CommunityChallenge,
];
