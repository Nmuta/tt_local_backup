import { Duration } from 'luxon';

export interface UGCFeaturedStatus {
  itemId: string;
  isFeatured: boolean;
  expiry?: Duration;
}
