import { GameTitle } from '@models/enums';
import {
  AppIcon,
  NavbarTool,
  CommonAccessLevels,
  ExtraIcon,
  HomeTileInfoExternal,
} from '../../helpers';

export const zendeskExternalTile = <HomeTileInfoExternal>{
  icon: AppIcon.ZendeskTool,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.Zendesk,
  accessList: CommonAccessLevels.OldNavbarAppOnly,
  title: 'Zendesk',
  subtitle: 'Tickets',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Ticket management and knowledge base',
  shortDescription: [`Ticket management and knowledge base`],
  externalUrl: 'https://support.forzamotorsport.net/admin',
};
