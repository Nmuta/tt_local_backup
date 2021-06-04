import { UserModel } from '@models/user.model';

/**
 * Defines the user state model.
 * Contains information about a user's identity and their roles.
 */
export class UserStateModel {
  public profile: UserModel;
  public accessToken: string;
}
