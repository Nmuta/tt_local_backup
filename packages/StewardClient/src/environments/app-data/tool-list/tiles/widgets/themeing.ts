import { AppIcon, NavbarTool, HomeTileInfoCustomTile, ExtraIcon } from '../../helpers';

export const themeingWidgetTile = <HomeTileInfoCustomTile>{
  icon: AppIcon.DeveloperTool,
  extraIcon: ExtraIcon.Custom,
  tool: NavbarTool.Theming,
  title: 'Theming',
  subtitle: 'Darkmode Toggle, etc',
  supportedTitles: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Adjust your theme settings',
  shortDescription: [`Adjust your theme settings here or in the cog menu.`],
  tileContentComponent: () =>
    import(
      '../../../../../app/shared/modules/theme/theme-tile-content/theme-tile-content.component'
    ).then(m => m.ThemeTileContentComponent),
  navComponent: () =>
    import(
      '../../../../../app/shared/modules/theme/theme-nav-content/theme-nav-content.component'
    ).then(m => m.ThemeNavContentComponent),
  hideLink: true,
};
