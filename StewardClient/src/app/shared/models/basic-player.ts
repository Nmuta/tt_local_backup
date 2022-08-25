import BigNumber from 'bignumber.js';

/** Interface for a basic player. Expect at least one Gamertag or Xuid, but not necessarily both. */
export interface BasicPlayer {
  xuid: BigNumber;
  gamertag: string;
}
