import { UserRoles } from './enums';

/** Interface for a signed in user model. */
export interface UserModel {
  emailAddress?: string;
  role?: UserRoles;
}

