import BigNumber from 'bignumber.js';
import { GamertagString } from '@models/extended-types';

/** The /v1/title/Woodstock/player/???/details model */
export interface WoodstockPlayerDetails {
  xuid: BigNumber;
  gamertag: GamertagString;
  region: BigNumber;
  licensePlate: string;
  customizationSlots: BigNumber[];
  currentDriverModelId: BigNumber;
  currentPlayerTitleId: BigNumber;
  currentPlayerBadgeId: BigNumber;
  currentCareerLevel: BigNumber;
  flags: BigNumber;
  blueprintThreadLevel: BigNumber;
  photoThreadLevel: BigNumber;
  tunerThreadLevel: BigNumber;
  painterThreadLevel: BigNumber;
  teamId: string;
  teamTag: string;
  roleInTeam: string;
  clubId: string;
  clubTag: string;
  roleInClub: string;
}
