import { UserRole } from '@models/enums';
import { chain } from 'lodash';
import { NavbarTool } from './helpers';
import { unprocessedToolList } from './list';

function allToolsForRole(role: UserRole): Partial<Record<NavbarTool, number>> {
  return chain(unprocessedToolList)
    .filter(t => t.accessList.includes(role))
    .map(t => [t.tool, 1])
    .fromPairs()
    .value();
}

/** A lookup table of UserRole -> Default Apps */
export const standardRoleTools: Partial<Record<UserRole, Partial<Record<NavbarTool, number>>>> = {
  [UserRole.CommunityManager]: allToolsForRole(UserRole.CommunityManager),
  [UserRole.DataPipelineAdmin]: allToolsForRole(UserRole.DataPipelineAdmin),
  [UserRole.DataPipelineContributor]: allToolsForRole(UserRole.DataPipelineContributor),
  [UserRole.DataPipelineRead]: allToolsForRole(UserRole.DataPipelineRead),
  [UserRole.LiveOpsAdmin]: allToolsForRole(UserRole.LiveOpsAdmin),
  [UserRole.SupportAgent]: allToolsForRole(UserRole.SupportAgent),
  [UserRole.SupportAgentAdmin]: allToolsForRole(UserRole.SupportAgentAdmin),
  [UserRole.SupportAgentNew]: allToolsForRole(UserRole.SupportAgentNew),
  [UserRole.GeneralUser]: {
    [NavbarTool.UserDetails]: 1,
    [NavbarTool.Gifting]: 2,
    [NavbarTool.Messaging]: 3,
    [NavbarTool.Endpoints]: 4,
    [NavbarTool.Theming]: 5,
  },
};
