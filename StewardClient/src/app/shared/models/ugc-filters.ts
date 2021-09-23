import BigNumber from 'bignumber.js';

export interface UGCFilters {
  carId: BigNumber;
  makeId: BigNumber;
  keyword: string;
  accessLevel: UGCAccessLevel;
  orderBy: UGCOrderBy;
}

export enum UGCAccessLevel {
  Any = 'Any',
  Public = 'Public',
  Private = 'Private',
}

export enum UGCType {
  Unknown = 'Unknown',
  Livery = 'Livery',
  Photo = 'Photo',
  Tune = 'Tune',
}

export enum UGCOrderBy {
  CreatedDateDesc = 'CreatedDateDesc',
  CreatedDateAsc = 'CreatedDateAsc',
  PopularityScoreDesc = 'PopularityScoreDesc',
  PopularityScoreAsc = 'PopularityScoreAsc',
}

export const DefaultUGCFilters: UGCFilters = {
  makeId: undefined,
  carId: undefined,
  keyword: null,
  accessLevel: UGCAccessLevel.Any,
  orderBy: UGCOrderBy.CreatedDateDesc,
};
