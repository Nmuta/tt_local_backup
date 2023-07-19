import { GuidLikeString } from '@models/extended-types';

/** Interface for a ban reason group. */
export interface BanReasonGroup {
  name: string;
  reasons: string[];
  banConfigurationId: GuidLikeString;
  featureAreas: string[];
}
