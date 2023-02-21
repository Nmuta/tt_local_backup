import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const racersCupTile = <HomeTileInfoInternal>{
  icon: AppIcon.RacersCup,
  tool: NavbarTool.RacersCup,
  accessList: CommonAccessLevels.RacersCup,
  title: 'Racers Cup',
  subtitle: 'Visualize when racing events occur',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Everything you need to know for upcoming Racers Cup events.',
  shortDescription: ['Tool for visualizing upcoming Racers cup events.'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/racers-cup/racers-cup.module').then(
      m => m.RacersCupModule,
    ),
};
