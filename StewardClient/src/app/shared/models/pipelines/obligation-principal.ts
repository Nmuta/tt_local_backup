/** Enum of valid values for types. */
export enum PrincipalType {
  User = 'aad_user',
  Group = 'aad_group',
}

/** Enum of valid values for roles. */
export enum PrincipalRole {
  Reader = 'reader',
  Admin = 'admin',
}

/** An obligation principal represents an individual or a group associated with a type of permission. */
export interface ObligationPrincipal {
  principal_type: PrincipalType;

  role: PrincipalRole;

  /**
   * For user roles, use the user's email address.
   * For group roles, use the AAD object ID of the group.
   */
  principal_value: string;
}
