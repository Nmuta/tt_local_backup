import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const welcomeCenterCalendarTile = <HomeTileInfoInternal>{
  icon: AppIcon.WelcomeCenterCalendar,
  tool: NavbarTool.WelcomeCenterCalendar,
  accessList: CommonAccessLevels.AdminAndGeneralUsers,
  title: 'Welcome Center Calendar',
  subtitle: 'View Welcome Center tiles on a day-by-day basis',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'View and validate Welcome Center tiles.',
  shortDescription: ['Tool for visualizing Welcome Center tiles on a day-by-day basis.'],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/welcome-center-calendar/welcome-center-calendar.module'
    ).then(m => m.WelcomeCenterCalendarModule),
};
