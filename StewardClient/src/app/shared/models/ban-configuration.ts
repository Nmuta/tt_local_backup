import { GuidLikeString } from '@models/extended-types';

/** Interface for a ban configuration. */
export interface BanConfiguration {
  banConfigurationId: GuidLikeString;
  friendlyName: string;
}
