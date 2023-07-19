import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const kustoTile = <HomeTileInfoInternal>{
  icon: AppIcon.Kusto,
  tool: NavbarTool.Kusto,
  title: 'Kusto',
  subtitle: 'Make kusto queries',
  supportedTitles: [GameTitle.FH4, GameTitle.FH5],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Perform stored and custom Kusto queries',
  shortDescription: [`Perform stored and custom Kusto queries`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/kusto/kusto.module').then(m => m.KustoModule),
};
