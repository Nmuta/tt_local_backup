import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_LATEST: ChangelogGroup = {
  title: '2022 Q2',
  id: '8d8286fe-2fd7-421a-bae8-607212cac0e2',
  entries: [
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
