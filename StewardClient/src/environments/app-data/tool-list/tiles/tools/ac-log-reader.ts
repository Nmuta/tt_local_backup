import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const acLogReaderTile = <HomeTileInfoInternal>{
  icon: AppIcon.AcLogReader,
  tool: NavbarTool.AcLogReader,
  title: 'AC Log Reader',
  subtitle: 'Decode client logs',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Decode gameplay logs.',
  shortDescription: ['Tool for decoding client logs.'],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ac-log-reader/ac-log-reader.module').then(
      m => m.AcLogReaderModule,
    ),
};
