import { GamertagString } from '@models/extended-types';

/** The /v1/title/Sunrise/player/???/details model */
export interface SunrisePlayerDetails {
  xuid: bigint;
  gamertag: GamertagString;
  region: bigint;
  licensePlate: string;
  customizationSlots: BigInt[];
  currentDriverModelId: bigint;
  currentPlayerTitleId: bigint;
  currentPlayerBadgeId: bigint;
  currentCareerLevel: bigint;
  flags: bigint;
  blueprintThreadLevel: bigint;
  photoThreadLevel: bigint;
  tunerThreadLevel: bigint;
  painterThreadLevel: bigint;
  teamId: string;
  teamTag: string;
  roleInTeam: string;
  clubId: string;
  clubTag: string;
  roleInClub: string;
}
