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
  orderBy: UgcOrderBy;
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
  LayerGroup = 'LayerGroup',
  Photo = 'Photo',
  Tune = 'Tune',
  EventBlueprint = 'EventBlueprint',
  TuneBlob = 'TuneBlob',
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

/**
 * Default values for UgcFilters.
 * @deprecated
 */
export const WoodstockSupportedUgcTypes = [
  UgcType.Livery,
  UgcType.LayerGroup,
  UgcType.Photo,
  UgcType.Tune,
  UgcType.EventBlueprint,
  UgcType.CommunityChallenge,
];

/** Types and metadata relating to supported UGC Types. */
export interface ExtendedSupportedUgcType {
  ugcType: UgcType;
  alternateName?: string;
}

/** Ordered list of Supported UGC Types for Woodstock*/
export const WoodstockExtendedSupportedUgcTypes: ExtendedSupportedUgcType[] = [
  { ugcType: UgcType.Livery },
  { ugcType: UgcType.LayerGroup, alternateName: 'Vinyl' },
  { ugcType: UgcType.Photo },
  { ugcType: UgcType.Tune },
  { ugcType: UgcType.EventBlueprint },
  { ugcType: UgcType.CommunityChallenge },
];

/** Ordered list of Supported UGC Types for Sunrise*/
export const SunriseExtendedSupportedUgcTypes: ExtendedSupportedUgcType[] = [
  { ugcType: UgcType.Livery },
  { ugcType: UgcType.LayerGroup, alternateName: 'Vinyl' },
  { ugcType: UgcType.Photo },
  { ugcType: UgcType.Tune },
  { ugcType: UgcType.EventBlueprint },
];
