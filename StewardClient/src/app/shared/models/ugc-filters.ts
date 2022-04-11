import BigNumber from 'bignumber.js';

export interface UgcFilters {
  carId: BigNumber;
  makeId: BigNumber;
  keyword: string;
  accessLevel: UgcAccessLevel;
  orderBy: UgcOrderBy;
}

export enum UgcAccessLevel {
  Any = 'Any',
  Public = 'Public',
  Private = 'Private',
}

export enum UgcType {
  Unknown = 'Unknown',
  Livery = 'Livery',
  Photo = 'Photo',
  Tune = 'Tune',
}

export enum UgcOrderBy {
  CreatedDateDesc = 'CreatedDateDesc',
  CreatedDateAsc = 'CreatedDateAsc',
  PopularityScoreDesc = 'PopularityScoreDesc',
  PopularityScoreAsc = 'PopularityScoreAsc',
}

export const DefaultUGCFilters: UgcFilters = {
  makeId: undefined,
  carId: undefined,
  keyword: null,
  accessLevel: UgcAccessLevel.Any,
  orderBy: UgcOrderBy.CreatedDateDesc,
};
