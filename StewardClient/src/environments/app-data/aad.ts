import { keys } from 'lodash';

/** Defines secondary AAD scopes used within Steward. */
export enum SecondaryAADScopes {
  UserRead = 'user.read',
  OpenId = 'openid',
  Profile = 'profile',
}

export const AllSecondaryAADScopes: string[] = keys(SecondaryAADScopes).map(
  key => SecondaryAADScopes[key],
);
