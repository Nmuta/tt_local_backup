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
      shortText: 'New inline copy-to-clipboard-icon. Further standardizing layout of chips',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionDetails },
      uuid: 'bd822683-a00f-429d-ac1f-48ecd1ef21f7',
      shortText: 'Display Car Name in addition to Car ID',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'eff26cfc-a21e-4df2-88f5-ace70b1a3251',
      shortText: 'Change navbar Steelhead references to FM',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'c0e47696-63fa-450f-aec3-3d4b8055ea01',
      shortText: 'Add link to FH5 Ban History PowerBi',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserGroupManagement },
      uuid: 'af6409e4-f04f-49e2-8069-c0842c2eb97d',
      shortText: 'Complete implementation of User Group UI for Steelhead',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '2dd8d695-2544-4408-b872-13ed1178f59b',
      shortText: 'Implement steelhead user group API',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'f0e7c22d-b662-447a-8c2f-dba92ab21981',
      shortText: 'Reduce breakage frequency of player picker chip when navigating between pages',
      longText: [
        'When navigating to a URL you were previously viewing a user on, pages will now repopulate the URL with appropriate query parameters instead of entering an unusable state.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '17a5b991-0f11-419f-8c35-1e45ef5d6624',
      shortText: 'Fix issues with navbar re-ordering',
    },
    {
      tag: { title: GameTitle.FH4, tool: NavbarTool.UserGroupManagement },
      uuid: '087e36ae-f823-430d-b4db-93e4d696b666',
      shortText: 'Complete implementation of User Group UI for FH4',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'f06a890a-f745-4591-8084-ab40a1307d9f',
      shortText: 'Fix text centering on home page and other misc centered-content pates',
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
