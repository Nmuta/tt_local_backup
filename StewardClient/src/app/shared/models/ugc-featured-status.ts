import { Duration } from 'luxon';

/** Model for body of Steward endpoint /api/v1/title/woodstock/storefront/itemId({ugcId})/featuredStatus */
export interface UgcFeaturedStatus {
  itemId: string;
  isFeatured: boolean;
  featuredExpiry?: Duration;
  forceFeaturedExpiry?: Duration;
}
