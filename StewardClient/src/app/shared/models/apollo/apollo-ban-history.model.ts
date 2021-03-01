import { ApolloBanArea } from './apollo-ban-request.model';

/** A ban history entry from apollo. */
export interface ApolloBanHistoryEntry {
  isActive: boolean;
  startTimeUtc: Date;
  expireTimeUtc: Date;
  lastExtendedTimeUtc: Date;
  countOfTimesExtended: bigint;
  xuid: bigint;
  title: 'apollo';
  requestingAgent: string;
  featureArea: ApolloBanArea;
  reason: string;
  banParameters: string;
}
