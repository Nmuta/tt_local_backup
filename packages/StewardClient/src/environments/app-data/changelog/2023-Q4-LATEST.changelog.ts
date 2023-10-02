import { GameTitle } from '@models/enums';
import { ChangelogGroup, ChangelogTag } from './types';
import { NavbarTool } from '../tool-list';

/** A changelog targeted at end-users. */
export const CHANGELOG_2023_Q4: ChangelogGroup = {
  title: '2023 Q4',
  id: 'e8b072e3-8238-4d23-a89e-ab266bc9b882',
  entries: [
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.UserDetails] },
      uuid: '07c21994-1791-40fb-b5df-593179f15225',
      shortText: `Add deep dive tab to player details.`,
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Leaderboards] },
      uuid: '832849f8-67a7-4f18-a70a-84d5c27310fe',
      shortText: 'Added ability to generate and download leaderboard score files',
      longText: [
        "Leaderboard score files are used for 3rd party Rival's events.",
        'They are sent to partners to verify participation.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '1562db7d-e132-4170-81b3-e30e23ea6106',
      shortText: 'Update changelog version',
    },
  ],
};
