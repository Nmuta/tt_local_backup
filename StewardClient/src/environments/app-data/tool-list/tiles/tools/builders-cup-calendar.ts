import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const buildersCupCalendarTile = <HomeTileInfoInternal>{
  icon: AppIcon.BuildersCupCalendar,
  tool: NavbarTool.BuildersCupCalendar,
  accessList: CommonAccessLevels.AdminAndGeneralUsers,
  title: 'Builders Cup Calendar',
  subtitle: "View featured Builder's Cup content on a day-by-day basis.",
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: "View and validate Builder's Cup featured races.",
  shortDescription: ["Tool for visualizing featured content in Builder's Cup."],
  loadChildren: () =>
    import(
      '../../../../../app/pages/tools/pages/builders-cup-calendar/builders-cup-calendar.module'
    ).then(m => m.BuildersCupCalendarModule),
};
