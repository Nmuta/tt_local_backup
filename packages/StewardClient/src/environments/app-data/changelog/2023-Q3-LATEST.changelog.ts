import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q3: ChangelogGroup = {
  title: '2023 Q3',
  id: 'd519bdc3-1704-4d33-a637-3cb7a5929522',
  entries: [
    {
      tag: ChangelogTag.Internal,
      uuid: '2c662d23-a44a-471f-862a-918f0e00c22e',
      shortText: 'Readd cyid to verify buttons in UGM Tool',
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
