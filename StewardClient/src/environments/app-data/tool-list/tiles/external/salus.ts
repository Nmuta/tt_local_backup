import { GameTitle } from '@models/enums';
import {
  AppIcon,
  NavbarTool,
  CommonAccessLevels,
  ExtraIcon,
  HomeTileInfoExternal,
} from '../../helpers';

export const salusExternalTile = <HomeTileInfoExternal>{
  icon: AppIcon.DeveloperTool,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.Salus,
  accessList: CommonAccessLevels.OldNavbarAppOnly,
  title: 'Salus',
  subtitle: 'An external UGC moderation tool',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'External UGC Moderation Tool',
  shortDescription: [`External UGC Moderation Tool`],
  externalUrl: 'https://gmx-dev.azureedge.net/#/dashboard',
};
