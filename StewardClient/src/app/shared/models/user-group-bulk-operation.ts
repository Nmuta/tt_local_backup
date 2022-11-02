import { BasicPlayer } from './basic-player';

export enum ForzaBulkOperationType {
  Add = 'Add',
  Remove = 'Remove',
}

export enum ForzaBulkOperationStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
}

/** Interface for the status of a user group bulk operation. */
export interface UserGroupBulkOperationStatus {
  userGroupId: number;
  blobId: string;
  completed: number;
  remaining: number;
  bulkOperationType: ForzaBulkOperationType;
  status: ForzaBulkOperationStatus;
  failedUsers: BasicPlayer[];
}
