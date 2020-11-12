/** The /v2/title/Sunrise/player/???/details model */
export interface SunrisePlayerDetails {
  xuid: BigInt;
  gamertag: string;
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
