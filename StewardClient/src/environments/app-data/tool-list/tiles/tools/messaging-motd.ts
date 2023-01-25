import { UserRole } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const motdTile = <HomeTileInfoInternal>{
  icon: AppIcon.MessageOfTheDay,
  tool: NavbarTool.MessageOfTheDay,
  accessList: [UserRole.LiveOpsAdmin],
  title: 'Message Of The Day',
  subtitle: 'Manage messages of the day',
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View and edit messages of the day.',
  shortDescription: [`View and edit messages of the day.`],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/message-of-the-day/message-of-the-day.module'
    ).then(m => m.MessageOfTheDayModule),
  hideFromUnauthorized: true,
};