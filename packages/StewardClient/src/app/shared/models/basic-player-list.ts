import BigNumber from 'bignumber.js';

/** Interface for an basic list of players either by xuid or gamertag. */
export interface BasicPlayerList {
  xuids: BigNumber[];
  gamertags: string[];
}
