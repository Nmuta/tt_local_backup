import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const buildersCupCalendarTile = <HomeTileInfoInternal>{
  icon: AppIcon.BuildersCupCalendar,
  tool: NavbarTool.BuildersCupCalendar,
  title: 'Builders Cup Calendar',
  subtitle: "View featured Builder's Cup content on a day-by-day basis.",
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: "View and validate Builder's Cup featured races.",
  shortDescription: ["Tool for visualizing featured content in Builder's Cup."],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/builders-cup-calendar/builders-cup-calendar.module'
    ).then(m => m.BuildersCupCalendarModule),
};
