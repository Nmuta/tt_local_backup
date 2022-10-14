import { Without } from '@helpers/types';
import { UserRole } from './enums';
import { GuidLikeString } from './extended-types';

/** A signed-in user model as known by the API. */
export interface ApiUserModel {
  emailAddress: string;
  role: UserRole;
  name: string;
  objectId: GuidLikeString;
}

/** A signed-in user model, enhanced by the UI. */
export interface ExtendedUserModel extends ApiUserModel {
  /** Client-only value. True if the user's Email Address is @microsoft. */
  isMicrosoftEmail?: boolean;
}

/** Values that can be overriden in the user model. */
export type UserModelOverrides = Without<
  Without<Partial<ExtendedUserModel>, 'emailAddress'>,
  'objectId'
>;

/** A complete signed-in user model, including optional overrides. */
export interface UserModel extends ExtendedUserModel {
  /** A partial profile that overrides given settings on the source profile. Any provided key will be overridden. */
  overrides?: UserModelOverrides;
}
