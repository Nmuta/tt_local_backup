import { GameTitle, UserRole } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const showroomCalendarTile = <HomeTileInfoInternal>{
  icon: AppIcon.ShowroomCalendarTile,
  tool: NavbarTool.ShowroomCalendar,
  accessList: [UserRole.LiveOpsAdmin, UserRole.GeneralUser],
  title: 'Showroom Calendar',
  subtitle: 'View Showroom information on a day-by-day basis',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View Showroom Information.',
  shortDescription: ['Tool for visualizing Showroom Banner and Sales on a day-by-day basis.'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/showroom-calendar/showroom-calendar.module').then(
      m => m.ShowroomCalendarModule,
    ),
};
