import BigNumber from 'bignumber.js';

export interface AuctionFilters {
  carId: BigNumber;
  makeId: BigNumber;
  status: AuctionStatus;
  sort: AuctionSort;
}

export enum AuctionStatus {
  Any = 'Any',
  Open = 'Open',
  Cancelled = 'Cancelled',
  Successful = 'Successful',
  Failed = 'Failed',
}

export enum AuctionSort {
  ClosingDateDescending = 'ClosingDateDescending',
  ClosingDateAscending = 'ClosingDateAscending',
}

export const DefaultAuctionFilters: AuctionFilters = {
  makeId: undefined,
  carId: undefined,
  status: AuctionStatus.Any,
  sort: AuctionSort.ClosingDateDescending,
};
