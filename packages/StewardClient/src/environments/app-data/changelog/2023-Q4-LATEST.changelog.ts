import { GameTitle } from '@models/enums';
import { MarkdownChangelogGroup, ChangelogTag } from './types';
import { NavbarTool } from '../tool-list';

/** A changelog targeted at end-users. */
export const CHANGELOG_2023_Q4: MarkdownChangelogGroup = {
  title: '2023 Q4',
  id: 'e8b072e3-8238-4d23-a89e-ab266bc9b882',
  entries: [
    {
      tag: {
        title: [GameTitle.FM8, GameTitle.FH5],
        tool: [NavbarTool.UserDetails, NavbarTool.GiftHistory, NavbarTool.Gifting],
      },
      uuid: '80db4db8-cbfb-4d63-a08d-48e403c6dbb1',
      shortMarkdown: 'Display source of items alongside acquisition time',
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Messaging] },
      uuid: '22a779b2-df4e-4c6b-a1de-2954580c4793',
      shortMarkdown: 'Update Steward api to send subcategory field for get localized strings',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: [NavbarTool.Leaderboards] },
      uuid: '02a287c0-26dc-4ada-af5f-58fe0fe42dfd',
      shortMarkdown:
        'Organize verify buttons so that they are next to associated action instead of on line above',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '46f3919e-ae1d-4cf6-8536-b6a1aa34e6ca',
      shortMarkdown: 'Fix some tiles not loading properly',
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Messaging] },
      uuid: '9d1ddfe8-0c45-4180-88a4-d2ab315483b0',
      shortMarkdown:
        'Switch Select Localized String from dropdown to autocomplete with grouped dropdown',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.PermissionManagement] },
      uuid: 'f603744e-d212-4213-ae52-86319f6a3608',
      shortMarkdown: 'Ignore permissions from removed titles & environments',
    },
    {
      tag: { title: GameTitle.FM8, tool: [NavbarTool.UserDetails] },
      uuid: '74048714-0464-4154-9f42-96d121b22f25',
      shortMarkdown: 'Avoid Out-of-memory error on Player Details -> Inventory',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.MessageOfTheDay },
      uuid: 'a05517ac-18b4-4250-ad44-63a94887bb38',
      shortMarkdown: 'Add start/end date fields',
    },
    {
      tag: {
        title: GameTitle.FM8,
        tool: NavbarTool.Messaging,
      },
      uuid: '465dc266-7e4e-415b-a1b4-097249eebe5e',
      shortMarkdown: 'Display error when player messaging fails',
    },
    {
      tag: {
        title: GameTitle.FM8,
        tool: [NavbarTool.MessageOfTheDay, NavbarTool.WelcomeCenterTiles],
      },
      uuid: '48e426ca-8f1a-43d2-a089-642d12ef912f',
      shortMarkdown: 'Content updates now point to retail playtest branch',
    },
    {
      tag: { title: '', tool: NavbarTool.PermissionManagement },
      uuid: 'f0f7eeb5-cc19-453c-80a8-193948c72cc8',
      shortMarkdown: `Display user's Object ID`,
      longMarkdown: `
        Manage User Permissions -> Selected User view, header
        - User's Object ID is displayed
        - Sub-title fields now auto-highlight (name, email, object id)

        User icon -> Profile view
        - User's \`ID\` is now called \`Object ID\`
      `,
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.UnifiedCalendar, NavbarTool.Leaderboards] },
      uuid: 'd7ca15e7-7193-442f-ab72-3f773d81ff53',
      shortMarkdown: `Add link from Rival's Event calendar selection to leaderboard scores for the event`,
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '2fc44ca8-e289-4d99-ba37-3b4f0d0c8bb4',
      shortMarkdown: 'Change input design for safety rating tool',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '5fc188e4-ab03-46a8-8a9c-15fc649a095d',
      shortMarkdown: 'Fix editing car defaulting car points and upgrades',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Gifting },
      uuid: '8287bbe8-c385-408d-b28a-83019506b774',
      shortMarkdown: 'Fix bug causing livery gifting to fail',
    },
    {
      tag: ChangelogTag.General,
      uuid: '08a52f50-ebea-44f5-9817-1a093aa2661c',
      shortMarkdown: 'Fix some buttons appearing too big throughout the application',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '988719c8-9f93-4d1f-9755-c176f6762835',
      shortMarkdown: 'Fix issue with timepicker forms',
      longMarkdown: `
        - Revert Luxon to previous major version
      `,
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: 'd4b1ac97-7488-42c3-b56b-66b76334846d',
      shortMarkdown: 'Fix bug causing safety rating component to fail to load',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '406999a7-40fc-4970-bcfe-4042864963e1',
      shortMarkdown: 'Fix auto lookup deep dive',
    },
    {
      tag: ChangelogTag.General,
      uuid: '61118503-8151-4a65-9217-62a1d2d49729',
      shortMarkdown: 'Fix bug to allow support for FM sidebar app in Zendesk',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: '636cbaf0-6230-4c32-ae27-34fd5109f174',
      shortMarkdown: 'Adjust layout of leaderboards search component for clarity',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '988719c8-9f93-4d1f-9755-c176f6762835',
      shortMarkdown: 'Fix issue with timepicker forms',
      longMarkdown: `
        - Revert Luxon to previous major version
      `,
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
