import BigNumber from 'bignumber.js';

export interface UGCFilters {
  type: UGCType;
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
}

export enum UGCOrderBy {
  CreatedDateDesc = 'CreatedDateDesc',
  CreatedDateAsc = 'CreatedDateAsc',
  PopularityScoreDesc = 'PopularityScoreDesc',
  PopularityScoreAsc = 'PopularityScoreAsc',
}

export const DefaultUGCFilters: UGCFilters = {
  type: UGCType.Livery,
  makeId: undefined,
  carId: undefined,
  keyword: null,
  accessLevel: UGCAccessLevel.Any,
  orderBy: UGCOrderBy.CreatedDateDesc,
};
