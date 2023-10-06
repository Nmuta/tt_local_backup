import { GameTitle } from '@models/enums';
import { MarkdownChangelogGroup, ChangelogTag } from './types';
import { NavbarTool } from '../tool-list';

/** A changelog targeted at end-users. */
export const CHANGELOG_2023_Q4: MarkdownChangelogGroup = {
  title: '2023 Q4',
  id: 'e8b072e3-8238-4d23-a89e-ab266bc9b882',
  entries: [
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: '636cbaf0-6230-4c32-ae27-34fd5109f174',
      shortMarkdown: 'Adjust layout of leaderboards search component for clarity',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '4e265673-61b2-49cb-a7df-775967a6ca19',
      shortMarkdown:
        'Fix bug in calendar lookup input sending API pegasus environment with incorrect casing',
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Gifting] },
      uuid: 'd7c4f499-5c52-4a26-a29a-aba8e7de2e16',
      shortMarkdown: "Remove 'Set Inventory From Reference' button",
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.UserDetails] },
      uuid: '07c21994-1791-40fb-b5df-593179f15225',
      shortMarkdown: `Add deep dive tab to player details.`,
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Leaderboards] },
      uuid: '832849f8-67a7-4f18-a70a-84d5c27310fe',
      shortMarkdown: 'Added ability to generate and download leaderboard score files',
      longMarkdown: `
        Leaderboard score files are used for 3rd party Rival's events.

        They are sent to partners to verify participation.
      `,
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '1562db7d-e132-4170-81b3-e30e23ea6106',
      shortMarkdown: 'Update changelog version',
    },
  ],
};
