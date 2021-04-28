/** An obligation principal represents an individual or a group associated with a type of permission. */
export interface ObligationPrincipal {
  principal_type: string;

  role: string;

  /**
   * For user roles, use the user's email address.
   * For group roles, use the AAD object ID of the group.
   */
  principal_value: string;
}
