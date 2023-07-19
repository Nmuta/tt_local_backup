import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const messagingTile = <HomeTileInfoInternal>{
  icon: AppIcon.Messaging,
  tool: NavbarTool.Messaging,
  oldToolRoutes: ['notifications'],
  title: 'Messaging',
  subtitle: 'Manage player messages',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM8],
  allPermissions: [PermAttributeName.MessageGroup, PermAttributeName.MessagePlayer],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Send, edit, and delete in-game messages.',
  shortDescription: [`Send, edit, and delete in-game messages.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/notifications/notifications.module').then(
      m => m.NotificationsModule,
    ),
};
