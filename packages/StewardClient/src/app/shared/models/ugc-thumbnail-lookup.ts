import { GuidLikeString } from '@models/extended-types';

/** Interface for results of thumbnail lookup. */
export interface LookupThumbnailsResult {
  id: GuidLikeString;
  thumbnail: string;
}
