import { UserRole } from '@models/enums';
import { values } from 'lodash';

/** The common access levels for the app. Used to generate role guards. */
export const CommonAccessLevels = {
  Everyone: values(UserRole),
  OldNavbarAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.GeneralUser,
  ],
  OldNavbarAppAdminOnly: [UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin, UserRole.GeneralUser],
  OldCommunityAppOnly: [UserRole.LiveOpsAdmin, UserRole.CommunityManager, UserRole.GeneralUser],
  OldCommunityAndNavbarAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.GeneralUser,
  ],
  DataPipelineAppOnly: [
    UserRole.LiveOpsAdmin,
    UserRole.DataPipelineAdmin,
    UserRole.DataPipelineContributor,
    UserRole.DataPipelineRead,
    UserRole.GeneralUser,
  ],
  CommunityManagersAndAdmins: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
    UserRole.GeneralUser,
  ],
  PlayerDetails: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.HorizonDesigner,
    UserRole.MotorsportDesigner,
    UserRole.GeneralUser,
  ],
  Leaderboards: [
    UserRole.LiveOpsAdmin,
    UserRole.HorizonDesigner,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
    UserRole.GeneralUser,
  ],
  RacersCup: [UserRole.LiveOpsAdmin, UserRole.MotorsportDesigner, UserRole.GeneralUser],
  UserGroupManagement: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.HorizonDesigner,
    UserRole.MotorsportDesigner,
    UserRole.GeneralUser,
  ],
  AdminPageAccess: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
    UserRole.GeneralUser,
  ],
  SearchUgc: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.GeneralUser,
  ],
  Gifting: [
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentNew,
    UserRole.CommunityManager,
    UserRole.MediaTeam,
    UserRole.GeneralUser,
  ],
  AdminAndGeneralUsers: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
};