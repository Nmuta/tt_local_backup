import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_Q4: ChangelogGroup = {
  title: '2022 Q4',
  id: 'cd4c3f29-ea08-4550-aec2-de051686419a',
  entries: [
    {
      tag: ChangelogTag.Internal,
      uuid: 'bd7d85cf-f67c-4801-ae72-437ff09421d3',
      shortText: 'New inline copy-to-clipboard-icon. Further standardizing layout of chips.',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionDetails },
      uuid: 'bd822683-a00f-429d-ac1f-48ecd1ef21f7',
      shortText: 'Display Car Name in addition to Car ID',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserDetails },
      uuid: 'f1346f2f-52c0-4bc5-81f2-dffd98a2eb42',
      shortText: 'Fix bug with ban history displaying duplicate entries',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: '943b2a39-8d00-430a-aa36-c1dbb2c7e57e',
      shortText: 'Add help popover for linking to talented user group management',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserGroupManagement },
      uuid: 'acb15139-69ba-4a53-a86a-b6c5ec5e7ed5',
      shortText: 'Complete implementation of User Group UI for FM7',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '852e7967-4915-488a-9e94-c2c1b34c0848',
      shortText: 'Adjust code linting rules',
    },
    {
      tag: ChangelogTag.General,
      uuid: '312b70bd-8fab-4d38-8cd8-6415a5bba3ea',
      shortText: 'Fix help popover overlay not dissapearing after route change',
    },
    {
      tag: { title: 'all', tool: NavbarTool.SearchUGC },
      uuid: '45bc12fc-5a04-4e7f-9720-b76be5cc9243',
      shortText: 'Add help popover for searching private UGC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '19bedbe0-dbc5-4e10-afa6-bd34784c1e95',
      shortText: 'Fix luxon interceptor to read in dates as UTC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5415ade4-074b-443d-8323-105ec29e90e6',
      shortText: 'Flipping changelog to Q4',
    },
  ],
};
