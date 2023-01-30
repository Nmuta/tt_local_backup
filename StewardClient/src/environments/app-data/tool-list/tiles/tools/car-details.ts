import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool, CommonAccessLevels } from '../../helpers';

export const carDetailsTile = <HomeTileInfoInternal>{
  icon: AppIcon.CarDetails,
  tool: NavbarTool.CarDetails,
  accessList: CommonAccessLevels.Everyone,
  title: 'Car Details',
  subtitle: 'View full car details',
  supportedTitles: [GameTitle.FH5],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Search cars to view their full details.',
  shortDescription: [`Search cars to view their full details.`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/car-details/car-details.module').then(
      m => m.CarDetailsModule,
    ),
};
