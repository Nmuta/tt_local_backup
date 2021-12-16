import { UserModel } from '@models/user.model';

/**
 * Defines the user state model.
 * Contains information about a user's identity and their roles.
 */
export class UserStateModel {
  /** The profile, as retrieved from the API and modified internally. */
  public profile: UserModel;
  /** The access token, as retrieved from the API. */
  public accessToken: string;
}
