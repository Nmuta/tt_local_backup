import { Duration } from 'luxon';

export interface UgcFeaturedStatus {
  itemId: string;
  isFeatured: boolean;
  expiry?: Duration;
}
