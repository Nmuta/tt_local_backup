import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_LATEST: ChangelogGroup = {
  title: '2022 Q2',
  id: '8d8286fe-2fd7-421a-bae8-607212cac0e2',
  entries: [
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserDetails },
      uuid: 'e42964d9-2637-480d-a4ac-ce798a3c9ab8',
      shortText: 'Fix UGC player search not pulling in private content.',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'ceaa380c-de3d-4a95-b880-7699d090d3d4',
      shortText: 'Modify file structure for UGC views.',
    },
    {
      tag: ChangelogTag.General,
      uuid: '829603f4-1411-441d-8123-3a3694a1b514',
      shortText: 'Fix color contrast issues in ban duration selector and notifications count icon.',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'a6047488-182f-4b0d-93f4-4c85c5c9d127',
      shortText: 'Add UGC feature button to UGC details',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'e58afaac-e7c0-4194-a7a1-0c789cf858db',
      shortText: 'Add environment selection to Leaderboard lookup.',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'd6d47959-e01d-48fe-bedd-a2845ade2941',
      shortText: 'Add export functionality to Leaderboard scores.',
    },
    {
      tag: ChangelogTag.General,
      uuid: '5a8d7afa-e87f-4d99-b8af-342134bb09fe',
      shortText: 'Link XUIDs to their player details page.',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '5c7fbae0-affa-4954-9546-7009b1e7a9e4',
      shortText: 'Link UGC search to UGC details.',
    },
    {
      tag: ChangelogTag.General,
      uuid: '1e13a1b0-44dc-48e8-8d97-9a8438f69cbf',
      shortText: 'Add new MediaTeam role',
      longText: [`MediaTeam role has read-only access to all data within the player details tool.`],
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserBanning },
      uuid: '0fc3d1ea-09be-471c-b146-2a3850244405',
      shortText: 'Adds ban expiry and deletion options to Ban History display',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserBanning },
      uuid: '68ad8f52-fb91-44af-b342-56460859df22',
      shortText: 'Correct light mode theming for Ban Options toggle group',
    },
    {
      tag: ChangelogTag.General,
      uuid: '1021d9a3-0cce-4fb6-8da9-5b29a8b89db4',
      shortText: 'Everyone has access to Confluence links in Help Popovers',
      longText: [
        `All employees in the Turn 10 Support & Safety Distribution Group should now have access to Steward subtree Confluence.
          This means that the confluence link in Help Popovers (such as the one that appears in the top right corner of Player Flags) will now be accessible.`,
        `If you do not have access, please contact t10opshelp@microsoft.com`,
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '7098fd1b-aa81-4b72-9022-bbe779066c93',
      shortText: 'Rework Changelog behavior and structure',
      longText: [
        'Changelog is now configured to automatically show changes by area and batch.',
        'A number of changelogs may be "active" at a time, and older changelogs are considered "inactive"',
        'Among the active changelogs, each area can be acknowledged or ignored, as well as all areas or individual changelog entries',
      ],
    },
  ],
};
