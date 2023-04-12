import { UserRole } from '@models/enums';
import { values } from 'lodash';

/** The common access levels for the app. Used to generate role guards. */
export const CommonAccessLevels = {
  // We should never accept UserRole.None into any tool route
  Everyone: values(UserRole).filter(role => role !== UserRole.None),
  OldNavbarAppOnly: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  OldNavbarAppAdminOnly: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  OldCommunityAppOnly: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  OldCommunityAndNavbarAppOnly: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  DataPipelineAppOnly: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  CommunityManagersAndAdmins: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  PlayerDetails: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  Leaderboards: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  RacersCup: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  UserGroupManagement: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  AdminPageAccess: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  SearchUgc: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  Gifting: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  AdminAndGeneralUsers: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
};
