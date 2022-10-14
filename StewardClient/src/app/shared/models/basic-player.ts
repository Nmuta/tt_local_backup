import BigNumber from 'bignumber.js';
import { StewardError } from './steward-error';

/** Interface for a basic player. Expect at least one Gamertag or Xuid, but not necessarily both. */
export interface BasicPlayer {
  xuid: BigNumber;
  gamertag: string;
}

/** Interface for a basic player action. Error property added to track errors in action. */
export interface BasicPlayerAction extends BasicPlayer {
  error?: StewardError;
}
