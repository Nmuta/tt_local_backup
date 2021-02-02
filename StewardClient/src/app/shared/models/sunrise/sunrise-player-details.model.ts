import { GamertagString } from '@models/extended-types';

/** The /v1/title/Sunrise/player/???/details model */
export interface SunrisePlayerDetails {
  xuid: BigInt;
  gamertag: GamertagString;
  region: BigInt;
  licensePlate: string;
  customizationSlots: BigInt[];
  currentDriverModelId: BigInt;
  currentPlayerTitleId: BigInt;
  currentPlayerBadgeId: BigInt;
  currentCareerLevel: BigInt;
  flags: BigInt;
  blueprintThreadLevel: BigInt;
  photoThreadLevel: BigInt;
  tunerThreadLevel: BigInt;
  painterThreadLevel: BigInt;
  teamId: string;
  teamTag: string;
  roleInTeam: string;
  clubId: string;
  clubTag: string;
  roleInClub: string;
}
