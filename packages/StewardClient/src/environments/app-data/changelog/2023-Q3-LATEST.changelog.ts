import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** A changelog targeted at end-users. */
export const CHANGELOG_2023_Q3: ChangelogGroup = {
  title: '2023 Q3',
  id: 'd519bdc3-1704-4d33-a637-3cb7a5929522',
  entries: [
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UnifiedCalendar },
      uuid: '34637ef2-c305-4514-bc20-a849bb90ede4',
      shortText: 'Add player and pegasus lookup inputs to all calendars',
    },
    {
      tag: {
        title: GameTitle.FM8,
        tool: [NavbarTool.UserDetails, NavbarTool.SearchUGC, NavbarTool.UgcDetails],
      },
      uuid: 'b1f43ed5-5d78-4499-bba4-4711af3c04a4',
      shortText: 'Add Replay UGC type',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'eebb7f54-e30b-47a8-9b6d-e1ef4addb8d0',
      shortText: 'Update to Angular 14',
      longText: ['Patch: Fix invalid routes.'],
    },
    {
      tag: { title: [GameTitle.Forte], tool: NavbarTool.PlayFab },
      uuid: 'a308d4fa-ef42-4fbf-b8b3-62e82bbcf16d',
      shortText: 'Setup PlayFab build locks for Forte Dev environment',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UgcDetails },
      uuid: '4503257d-09b6-42fc-a973-9cb389c2184b',
      shortText: 'Add ability to select report reason for report UGC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'a5450e39-f141-4fe3-89de-23c9e558e212',
      shortText: 'Small fixes to home tour',
      longText: [
        'Only show home tour when app is in a valid state.',
        'Allow buttons to be clickable under highlight buffer.',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.BountyDetails },
      uuid: '6eca390d-1d90-4b4a-8727-b65fff0503eb',
      shortText: 'Add new tool to view bounty details',
    },
    {
      tag: ChangelogTag.General,
      uuid: '5041b54e-52f2-4f02-8c74-4d6c29550bc5',
      shortText: 'Implemented new user tour guides',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'e298bf3d-042c-429f-bc33-49de2bd3cfbb',
      shortText: 'Fix Component Governance issues',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.SearchBounty },
      uuid: '7a34748a-90a2-48f3-a620-d2aa6408a478',
      shortText: 'Add new tool to search rivals bounties',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'f5a5ea45-1ea4-4a36-aed7-55140bc0aada',
      shortText: 'Automatically select Staging API when using Staging UI',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.Leaderboards },
      uuid: '069c7aa4-1424-4f15-ae7b-cf082cd5531f',
      shortText: 'Add Time Attack leaderboards',
    },
    {
      tag: { title: 'all', tool: NavbarTool.ProductPricing },
      uuid: 'c069381d-0e34-48f2-9384-04eb317b79cc',
      shortText:
        'Add ability to look up any product ID alongside dropdown to select Forza products',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionBlocklist },
      uuid: 'a6e7f4a7-7345-4f27-9446-83680ae4e516',
      shortText: 'Update auction blocklist to display new accurate data',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '3594283a-d0e7-4d79-bfd0-ebc0de4eafd8',
      shortText: 'Add Layer Group & Game Options UGC types',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '0c6114ad-6e1b-46c7-a3ee-ebca53244f65',
      shortText: 'Small fixes to Steward sidebars',
      longText: [
        'Add ability to filter internal changelog entries.',
        'Only show team lead spinner when permission contact us is selected.',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: 'aa341f06-663e-4e39-b54e-1fab661a54c9',
      shortText: 'Add tool to download and upload UGC profiles',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.PlayFab },
      uuid: 'ff41cada-62b2-4183-88ac-66f4a0c3a52a',
      shortText: 'Display API key name when used to lock PlayFab build',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserDetails },
      uuid: '460ce787-24b6-4537-9fb9-43e61d625f68',
      shortText: 'Allow modifying PlayFab voucher amounts on each available inventory collection',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'dd0629a3-9e75-4dba-bbd8-371f075da694',
      shortText: 'Fix bug preventing sending',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: '2078cd4d-475e-48a0-a250-12c56fc83a5e',
      shortText: 'Add tools to view PlayFab inventory and transaction history',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '52c8dc76-b903-4a51-be37-d8a37556a60f',
      shortText: 'Add missing timer types and popup fields.',
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Gifting, NavbarTool.UserDetails] },
      uuid: '55fb491b-4b57-4f86-8971-b0a8760d66a7',
      shortText: 'Add Driver Suit item type to inventory management and gifting',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '645aa649-6b61-4fd4-98c1-75edccad1e59',
      shortText: 'Moved ban submit button to top right of card',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserBanning },
      uuid: '7778ac73-29d8-4820-b582-2a8e57a3cf07',
      shortText: 'Updated so duration and feature area of ban are decided by ban reason',
      longText: [
        'If you need to ban for other areas or durations, you can use the override options',
      ],
    },
    {
      tag: { title: 'all', tool: NavbarTool.PermissionManagement },
      uuid: '54f931b4-a4b9-452f-b7a6-340799459e45',
      shortText: 'Add support for team leads',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '6c597f0d-b61f-4a33-80dc-e1caecf03a92',
      shortText: 'Display additional info when banning user for UGC',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'ca1658d4-d493-48f3-ae8d-3fcc57a0b530',
      shortText: 'Add request Permission or ask Question to Contact Us sidebar',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.PlayFab },
      uuid: 'bf0278c0-45d2-408e-99a8-bcab7cc85caa',
      shortText: 'Support PlayFab retail environment',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '2c662d23-a44a-471f-862a-918f0e00c22e',
      shortText: 'Re-add Cypress Id (cyid) to verify buttons in UGM Tool',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '6745e1e0-74ff-4bb0-acaa-01cfc74e8264',
      shortText: 'Fix typo in UGC Edit',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UnifiedCalendar },
      uuid: 'a3590af3-e45c-4f9e-a2a8-0104d1b99745',
      shortText: 'Add multiple improvements',
      longText: [
        'Cursor is not a pointer for calendar links',
        'Events show as multliple days on the week view for Rivals and Showroom',
        'Display showroom dates as Utc',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '8f63c75e-619b-4608-a9fe-8d4b91ebe394',
      shortText: 'Refactor deeplink destination component',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '2f4e2a73-f8f5-4bdf-a242-169a3a5d9ead',
      shortText: 'Add UGC featuring modal for Steelhead',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'f65dda02-6560-4ab5-815a-e8b6f41e7552',
      shortText: 'Force featured end date is now selectable in UGC details',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.LspTasks },
      uuid: 'ded9dabb-5e0b-4e7c-af71-6567f5ac1881',
      shortText: 'Add new component to view and manage LSP tasks',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '9e643b0c-00f4-4ac0-a1c9-d32027e22fef',
      shortText: 'Switch verification mode to V2 for Profile Management',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '25ecd357-16eb-40c9-bc58-24ccbc8fc21a',
      shortText: 'Add ability to edit title and description for UGC',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'f77d9fb2-1ace-4fa6-ac1b-c836fb7ab159',
      shortText: 'Auto-reload player report weight after changing their player flags',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'a5ff736e-743e-481a-b659-83f8cc9a51c2',
      shortText: 'Switch to using Verify V2 in multiple areas',
      longText: [
        'Auction Blocklist on Woodstock and Sunrise',
        'Gift Special Liveries on Woodstock',
        'User Group Management on all titles',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '7ad05002-bc70-4022-8dd3-3001ebda96c2',
      shortText: 'Remove no user role, provide email link in login error page',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.ServicesTableStorage },
      uuid: 'e8f7a5a004-fce6-4772-a015-50a346a6872f',
      shortText: 'Remove T10Id as lookup option',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: 'e8a27035-dc62-4eaa-96a7-d00d76e21e25',
      shortText: 'Hidden UGC is a seperate tab and split up by UGC type',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CreateAuction },
      uuid: 'dab5bf51-fd02-46ec-bf29-e20cb13e42f6',
      shortText: 'Add default icon to create button in create single auction',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UserDetails },
      uuid: '72ccd2b5-fd86-4714-863c-fc83218d54d3',
      shortText: 'Clear note input field after adding a profile note',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.SearchUGC },
      uuid: '65f7537d-78a4-4e61-8b7e-f581a8e9bfaf',
      shortText: 'Improve Ugc search visual',
      longText: [
        'Display new label when featured Ugc has no end date.',
        'Reduce featured Ugc row opacity to see when they are selected.',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Endpoints },
      uuid: '4e991b31-5a72-41ba-ba46-58341f8cf52b',
      shortText: 'Add Retail endpoint for Steelhead',
    },
    {
      tag: { title: 'all', tool: NavbarTool.ProductPricing },
      uuid: 'c2b316d0-e582-490c-aa0a-cdccecd018de',
      shortText: 'Add product pricing tool',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '69e6005d-7d90-484a-b45c-4eb3c8a86c43',
      shortText: 'Force VIP to be checked if Ultimate VIP is checked',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '8c3092e0-a248-4d3a-9ec1-8dd867c2b209',
      shortText: 'Improve local re-build times',
      longText: [
        'Developer re-build times took 60+ seconds. Now they take 10.',
        'Build commands have also been adjusted and restructured.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'e9977caf-bbd6-429a-9804-6493094b456c',
      shortText: 'Address stylesheet size warnings',
      longText: [
        'Reduce stylesheet sizes for calendar pages.',
        'Increase stylesheet budget for all pages from 6k to 32k.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5433e9fd-fb43-4702-a5bc-899623a810da',
      shortText: 'Reduce duplicate style generation',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'caf46095-1749-46e0-bb9c-57682c61dc1f',
      shortText: 'Stylesheet refactoring in preparation for SCSS 2.0',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '1469d347-06f9-40d7-9c47-f901d6af5a9c',
      shortText: 'Add ability to modify Geo Flags on UGC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '672f8ca5-285d-4ba1-9dea-1a91c4b1aafe',
      shortText: 'Convert data from Pegasus to use new StartEndDate property',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.SearchUGC },
      uuid: 'f4563a2f-9f91-4da7-ade2-ef634ec2e6d6',
      shortText: 'Add ability to load curated UGC queues',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Messaging },
      uuid: '5d178034-3d32-4071-a49f-b941f7e234f3',
      shortText: 'Add message title view and editing for player messages',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: '0cd8e85a-b5e2-49e2-8a25-4a4d38a00d2d',
      shortText: 'Look ups for dev leaderboards now pull from services studio environment',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: '03478150-f427-4b0b-97d2-508c9d42b88b',
      shortText: 'Hidden UGC is a seperate tab and split up by UGC type',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '806596e2-19b8-4f1c-9fcd-bf7c43654dd6',
      shortText:
        'Remove all references to FH5 StorefrontService, move relevant logic to V2 controllers',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Messaging },
      uuid: '5d178034-3d32-4071-a49f-b941f7e234f3',
      shortText: 'Add message title view and editing for group messages',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.ServicesTableStorage },
      uuid: 'a66f8898-b059-4e34-b503-5cf2c7bdf5f9',
      shortText: 'Add toggle to filter out non profile-specific rows',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '68ba527e-4a44-4bb6-bfea-f890c4fcde4e',
      shortText: 'Use Pegasus data to populate dropdowns',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '9d55719a-b460-43e1-8b92-2f9b6f71474e',
      shortText: 'Implemented new deeplink destination type',
    },
  ],
};
