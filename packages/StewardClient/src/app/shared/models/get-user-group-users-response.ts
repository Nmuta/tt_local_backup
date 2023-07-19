import { BasicPlayer } from './basic-player';

/** Interface for a Get User Group Users response. */
export interface GetUserGroupUsersResponse {
  playerList: BasicPlayer[];
  playerCount: number;
}
