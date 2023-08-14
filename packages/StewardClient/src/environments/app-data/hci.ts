/** Constants for human usability. */
export const HCI = {
  /**
   * User is typing -> (no search)
   * User stops typing -> (Delay) -> perform automatic search
   */
  TypingToAutoSearchDebounceMillis: 200,
  DirectiveInputDebounceMillis: 50,
  AutoRetryMillis: 3_000,
  /**
   * Used when we need to give PlayFab time to propogate actions taken on their platform.
   * Example: Adding currency needs to propogate in a player's inventory & transaction history
   */
  PlayFabPropagationMillis: 1_000,
  Toast: {
    Duration: {
      Short: 2_000,
      Standard: 3_000,
      Long: 10_000,
    },
    Text: {
      Dismiss: 'Dismiss',
      Acknowledge: 'Okay',
    },
    Class: {
      Warn: 'snackbar-warn',
      Info: 'snackbar-info',
    },
  },
};
