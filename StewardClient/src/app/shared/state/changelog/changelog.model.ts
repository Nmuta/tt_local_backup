/** Defines the changelog model. */
export class ChangelogModel {
  disableAutomaticPopup: boolean; // TODO: Use this value
  activeChangeUuids: {
    acknowledged: string[];
    pending: string[];
  };
  // TODO: Inactive Changelog
}
