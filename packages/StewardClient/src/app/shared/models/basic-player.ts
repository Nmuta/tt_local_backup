import BigNumber from 'bignumber.js';
import { XOR } from 'ts-essentials';
import { StewardError } from './steward-error';

/** Basic player model with gamertag requirement. */
export interface BasicPlayerWithGamertag {
  gamertag: string;
  xuid?: BigNumber;
}

/** Basic player model with xuid requirement. */
export interface BasicPlayerWithXuid {
  xuid: BigNumber;
  gamertag?: string;
}

/** Valid basic player model. */
export type BasicPlayer = XOR<BasicPlayerWithGamertag, BasicPlayerWithXuid>;

/** Basic player action result model. */
export type BasicPlayerActionResult = BasicPlayer & {
  error?: StewardError;
};
