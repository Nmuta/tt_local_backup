import { GameTitle } from '@models/enums';
import {
  AppIcon,
  NavbarTool,
  CommonAccessLevels,
  ExtraIcon,
  HomeTileInfoExternal,
} from '../../helpers';

export const sprinklrExternalTile = <HomeTileInfoExternal>{
  icon: AppIcon.ZendeskTool,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.Sprinklr,
  accessList: CommonAccessLevels.OldCommunityAppOnly,
  title: 'Sprinklr',
  subtitle: 'Social Media Tools',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Social Media Tools',
  shortDescription: [`"Unified customer experience management platform"`],
  externalUrl: 'https://app.sprinklr.com/ui/app-redirect',
};
