import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import {
  AppIcon,
  NavbarTool,
  ExtraIcon,
  HomeTileInfoExternal,
  HomeTileRestrictionType,
} from '../../helpers';

export const pegasusExternalTile = <HomeTileInfoExternal>{
  icon: AppIcon.DeveloperTool,
  extraIcon: ExtraIcon.External,
  tool: NavbarTool.Pegasus,
  title: 'Pegasus',
  subtitle: 'Forza CMS',
  supportedTitles: [GameTitle.FH5, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Web Services for CMS authoring, snapshotting and publishing',
  shortDescription: [`Web Services for CMS authoring, snapshotting and publishing`],
  externalUrl: 'https://cms.services.forzamotorsport.net/',
  restriction: {
    requiredPermissions: [PermAttributeName.AdminFeature],
    action: HomeTileRestrictionType.Disable,
  },
};
