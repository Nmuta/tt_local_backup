import { GameTitle } from '@models/enums';
import { AppIcon, NavbarTool, HomeTileInfoCustomTile, ExtraIcon } from '../../helpers';

export const endpointsWidgetTile = <HomeTileInfoCustomTile>{
  icon: AppIcon.Endpoints,
  extraIcon: ExtraIcon.Custom,
  tool: NavbarTool.Endpoints,
  title: 'Current Endpoints',
  subtitle: 'Navbar widget',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription:
    'Options for changing current endpoint settings. Hover over the grid to view current settings',
  shortDescription: [
    `View and adjust your current endpoint settings in the navbar.`,
    `Includes a toggle for Forza Motorsport and Forza Horizon 5, one-click-switch to Retail and Studio, and a summary grid of the currently active endpoints. `,
  ],
  navComponent: () =>
    import(
      '../../../../../app/shared/modules/endpoints/endpoints-nav-tool/endpoints-nav-tool.component'
    ).then(m => m.EndpointsNavToolComponent),
  hideLink: true,
};
