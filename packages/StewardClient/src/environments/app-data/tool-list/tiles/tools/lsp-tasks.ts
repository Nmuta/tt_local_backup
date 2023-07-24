import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const lspTasksTile = <HomeTileInfoInternal>{
  icon: AppIcon.LspTasks,
  tool: NavbarTool.LspTasks,
  title: 'LSP Tasks',
  subtitle: 'Manage LSP Tasks',
  supportedTitles: [GameTitle.FM8, GameTitle.FH5],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Lookup and update LSP tasks',
  shortDescription: [`Lookup and update LSP tasks`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/lsp-tasks/lsp-tasks.module').then(
      m => m.LspTasksModule,
    ),
};
