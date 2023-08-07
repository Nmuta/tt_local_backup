import { GuidLikeString } from '@models/extended-types';
import { DateTime } from 'luxon';

/** PlayFab inventory collection ids. */
export enum PlayFabCollectionId {
  Default='Default',
  GDK='GDK',
  Steam='Steam',
}

/** PlayFab multiplayer server build summary. */
export interface PlayFabBuildSummary {
  // API response also includes meta and region data that isn't used yet
  id: GuidLikeString;
  name: string;
  creationDateUtc?: DateTime;
}

/** PlayFab multiplayer server build lock. */
export interface PlayFabBuildLock {
  id: GuidLikeString;
  reason: string;
  userId: string;
  playFabEnvironment: string;
  gameTitle: string;
  dateCreatedUtc: DateTime;
  metaData: string;
}

/** Represents a PlayFab inventory change request. */
export interface PlayFabInventoryChangeRequest {
  itemId: string;
  amount: number;
}

/** Represents a PlayFab inventory item. */
export interface PlayFabInventoryItem {
  amount: number;
  id: string;
  stackId: string;
  type: string;
  displayProperties?: unknown; // Leaving as until property is needed in UI
  name: string;
}

/** Represents a PlayFab transaction. */
export interface PlayFabTransaction {
  itemType: string;
  operations: PlayFabTransactionOperation[];
  operationType: string;
  purchaseDetails: unknown; // Returned by API, leaving unknown unless we need it
  redeemDetails: unknown; // Returned by API, leaving unknown unless we need it
  timestampUtc: DateTime;
  transactionId: string;
  transferDetails: unknown; // Returned by API, leaving unknown unless we need it
}

/** Represents a PlayFab transaction operation. */
export interface PlayFabTransactionOperation {
  amount?: number;
  itemId: string;
  itemType: string;
  itemName: string;
  stackId: string;
  type: string;
}

/** Represents a PlayFab currency voucher. */
export interface PlayFabVoucher {
  id: string;
  contentType: string;
  title: Map<string, string>;
  description: Map<string, string>;
  startDate?: DateTime;
  endDate?: DateTime;
  type: string;
}
