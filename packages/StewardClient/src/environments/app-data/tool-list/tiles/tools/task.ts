import { GameTitle } from '@models/enums';
import { HomeTileInfoInternal, AppIcon, NavbarTool } from '../../helpers';

export const taskTile = <HomeTileInfoInternal>{
  icon: AppIcon.Task,
  tool: NavbarTool.Task,
  title: 'Task',
  subtitle: 'Manage LSP Tasks',
  supportedTitles: [GameTitle.FM8, GameTitle.FH5],
  allPermissions: [],
  imageUrl: undefined,
  imageAlt: undefined,
  tooltipDescription: 'Lookup and update LSP tasks',
  shortDescription: [`Lookup and update LSP tasks`],
  loadChildren: () =>
    import('../../../../../app/pages/tools/pages/task/task.module').then(m => m.TaskModule),
};
