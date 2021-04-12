import { UserRole } from './enums';
import { GuidLikeString } from './extended-types';

/** Interface for a signed in user model. */
export interface UserModel {
  emailAddress: string;
  role: UserRole;
  name: string;
  objectId: GuidLikeString;
}
