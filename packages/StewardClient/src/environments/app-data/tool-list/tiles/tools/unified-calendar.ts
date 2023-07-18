import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const unifiedCalendarTile = <HomeTileInfoInternal>{
  icon: AppIcon.UnifiedCalendar,
  tool: NavbarTool.UnifiedCalendar,
  title: 'Calendars',
  subtitle: "Find out what's coming up soon",
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Everything you need to know for upcoming events.',
  shortDescription: ['Tools for visualizing upcoming events.'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/unified-calendar/unified-calendar.module').then(
      m => m.UnifiedCalendarModule,
    ),
};
