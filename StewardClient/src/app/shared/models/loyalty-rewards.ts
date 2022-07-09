/**
 * Interface for a record that determines if a player played
 * a past title and recieved a loyalty reward for doing so.
 */
export interface HasPlayedRecord {
  gameTitle: string;
  hasPlayed: boolean;
  sentProfileNotification: boolean;
}
