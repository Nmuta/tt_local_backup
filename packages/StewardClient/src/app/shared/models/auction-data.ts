import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';
import { GuidLikeString } from './extended-types';

export interface AuctionData {
  auctionId: GuidLikeString;
  status: AuctionDataAuctionStatus;
  sellerXuid: BigNumber;
  sellerProfileId: GuidLikeString;
  openingPrice: BigNumber;
  buyoutPrice: BigNumber;
  currentPrice: BigNumber;
  createdDateUtc: DateTime;
  closingDateUtc: DateTime;
  isVipAuction: boolean;
  isTurn10Auction: boolean;
  timeFlaggedUtc?: DateTime;
  duration: Duration;
  isFeatured: boolean;
  amountInvested: BigNumber;
  isHotDeal: boolean;
  tunerLevel: BigNumber;
  bids: AuctionDataBid[];
  car: AuctionDataCar;
  userReportTotal: BigNumber;
  userReportCollectionId: BigNumber;
  reportingState: AuctionDataReportingState;
  isCarRetrieved: boolean;
  isPaymentCollected: boolean;
  liveryLayers: BigNumber;
  numberOfLiveryContributors: BigNumber;
  nextBidAmount: BigNumber;
  allowedActions: AuctionDataAuctionAction[];
  topBidAmount: BigNumber;
  topBidderXuid: BigNumber;
  paBigNumbererLevel: BigNumber;
  bidCount: BigNumber;
}

export enum AuctionDataAuctionStatus {
  Open = 'Open',
  Cancelled = 'Cancelled',
  Successful = 'Successful',
  Failed = 'Failed',
  Any = 'Any',
}

export enum AuctionDataReportingState {
  Default = 'Default',
  FlaggedForReview = 'FlaggedForReview',
  AdminRemoved = 'AdminRemoved',
  AdminApproved = 'AdminApproved',
}

export enum AuctionDataAuctionAction {
  None = 'None',
  Bid = 'Bid',
  Buyout = 'Buyout',
  ResolveWon = 'ResolveWon',
  ResolveFailedAuction = 'ResolveFailedAuction',
  Restart = 'Restart',
  Cancel = 'Cancel',
  Report = 'Report',
  RemoveBannedItem = 'RemoveBannedItem',
  ReceiveMoneyAuctionOutbid = 'ReceiveMoneyAuctionOutbid',
  ReceiveMoneyAuctionSold = 'ReceiveMoneyAuctionSold',
}

export interface AuctionDataBid {
  xuid: BigNumber;
  profileId: GuidLikeString;
  amount: BigNumber;
  dateUtc: DateTime;
  status: AuctionDataBidStatus;
  isTopBid: boolean;
}

export enum AuctionDataBidStatus {
  Escrow = 'Escrow',
  WaitingForRetrievalByBidder = 'WaitingForRetrievalByBidder',
  WaitingForRetrievalByAuctionOwner = 'WaitingForRetrievalByAuctionOwner',
  Retrieved = 'Retrieved',
  Cancelled = 'Cancelled',
}

export interface AuctionDataCar {
  wasOriginallyFromAuctionHouse: boolean;
  wasOriginallyGifted: boolean;
  speedRating: BigNumber;
  accelerationRating: BigNumber;
  launchRating: BigNumber;
  brakingRating: BigNumber;
  handlingRating: BigNumber;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
  carHistory: AuctionDataCarHistory;
  partsInTrunk: BigNumber[];
  vin: GuidLikeString;
  lastAuctionId: BigNumber;
  carDivisionId: BigNumber;
  isMotorsportEdition: boolean;
  isReward: boolean;
  isOnlineOnly: boolean;
  isUnicorn: boolean;
  powertrainId: BigNumber;
  make: BigNumber;
  carId: BigNumber;
  garageId: BigNumber;
  manColorIndex: BigNumber;
  countryId: BigNumber;
  displacementId: BigNumber;
  aspirationTypeId: BigNumber;
  performanceIndex: BigNumber;
  performanceIndexFriendly: BigNumber;
  carClass: BigNumber;
  year: BigNumber;
  peakPower: BigNumber;
  peakTorque: BigNumber;
  curbWeight: BigNumber;
  weightDistribution: BigNumber;
  isLiveryLocked: boolean;
  numberOfLiveryContributors: BigNumber;
}

export interface AuctionDataCarHistory {
  CurOwnerWinnings: BigNumber;
  CurOwnerNumRaces: BigNumber;
  HighestSkillScore: BigNumber;
  NumSkillPointsEarned: BigNumber;
  NumTimesSold: BigNumber;
  NumOwners: BigNumber;
  CurOwnerPurchaseDate: BigNumber;
  NumRaces: BigNumber;
  NumPodiums: BigNumber;
  TotalRepairs: BigNumber;
  TotalWinnings: BigNumber;
  TimeDriven: BigNumber;
  DistanceDriven: BigNumber;
  Xp: BigNumber;
  NumVictories: BigNumber;
  OriginalOwner: string;
}
