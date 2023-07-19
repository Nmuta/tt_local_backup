import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const acLogReaderTile = <HomeTileInfoInternal>{
  icon: AppIcon.AcLogReader,
  tool: NavbarTool.AcLogReader,
  title: 'Anti-Cheat Log Reader',
  subtitle: 'Decode client crash logs to find evidence of cheating',
  supportedTitles: [GameTitle.FM8],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Decode gameplay crash logs.',
  shortDescription: [
    'Tool for decoding client logs (.Crash_Info files) to find evidence of cheating.',
  ],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/ac-log-reader/ac-log-reader.module').then(
      m => m.AcLogReaderModule,
    ),
};
