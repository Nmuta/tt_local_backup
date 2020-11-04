/** The /v2/title/Sunrise/player/???/details model */
export interface SunrisePlayerDetails {
  xuid: number;
  gamertag: string;
  region: number;
  licensePlate: string;
  customizationSlots: number[];
  currentDriverModelId: number;
  currentPlayerTitleId: number;
  currentPlayerBadgeId: number;
  currentCareerLevel: number;
  flags: number;
  blueprintThreadLevel: number;
  photoThreadLevel: number;
  tunerThreadLevel: number;
  painterThreadLevel: number;
  teamId: string;
  teamTag: string;
  roleInTeam: string;
  clubId: string;
  clubTag: string;
  roleInClub: string;
}
