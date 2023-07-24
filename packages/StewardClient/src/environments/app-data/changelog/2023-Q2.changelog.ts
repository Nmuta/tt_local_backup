import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q2: ChangelogGroup = {
  title: '2023 Q2',
  id: '61c8581b-b329-44e3-9e73-52e55df21292',
  entries: [
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: '7bbd5f84-b9ec-4854-b1fc-e1982659d389',
      shortText: 'Implement bulk UGC reporting in UGC Search',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CreateAuction },
      uuid: 'c1eac190-9ab8-4b19-9f39-796a62271153',
      shortText: 'Ensure valid car is selected in create single auction',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CarDetails },
      uuid: 'c6275cf3-6366-40e7-b765-48488263f477',
      shortText: 'Target CU-Next in Woodstock car details lookup',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CreateAuction },
      uuid: '8db18c20-e408-4237-becc-58d6408aa5bb',
      shortText: 'Change create single auction to use verify V2 and move buttons',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'e1b03cab-7326-4a35-aec9-f6d9a5bc037d',
      shortText: 'Change form array for display conditions in welcome center tiles',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UserDetails },
      uuid: '9e8da39e-c8aa-490e-b712-564b1823a4f2',
      shortText: 'Profile notes can now be added to player details',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.AdminPagesSelector },
      uuid: 'c9930424-33e9-4a5d-a551-ab7a4c01147f',
      shortText: 'Removed links to Steelhead admin pages',
    },
    {
      tag: {
        title: [GameTitle.FH5, GameTitle.FH4, GameTitle.FM7, GameTitle.FM8],
        tool: NavbarTool.UserDetails,
      },
      uuid: '7d8cdf02-2042-46eb-8725-e267cabac8eb',
      shortText: 'Display ban count per title',
    },
    {
      tag: ChangelogTag.General,
      uuid: '6ceff20c-1dc0-48e1-8044-a7be33a0a994',
      shortText: 'Add title and environment to permission tooltip',
    },
    {
      tag: ChangelogTag.General,
      uuid: '22b4ce22-a3d4-4fb7-91d3-6b50e21f9280',
      shortText: 'Adjust spacing of navbar icons',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'f703a92a-dac4-41d0-8265-5826bb17df0a',
      shortText: 'Added C-Livery download for Woodstock and Steelhead',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: 'dec40db0-c132-4b04-b31a-ec7d4b847d5d',
      shortText:
        'Add button to generate sharecodes for public UGC search results without a sharecode',
    },
    {
      tag: ChangelogTag.General,
      uuid: '8cb3427a-a9a5-4e94-9e69-5d9f628a751b',
      shortText: 'Reorder navbar icons and link to docs',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5c5ae753-ac77-45ee-80fb-63824fa7cf17',
      shortText: 'Remove old verify-with directive and rename module',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4, GameTitle.FM7], tool: NavbarTool.UserDetails },
      uuid: '6c281c82-d209-4a9a-9620-f4337b55604f',
      shortText: 'Fixed active profile icon to not show as inactive.',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: 'dec40db0-c132-4b04-b31a-ec7d4b847d5d',
      shortText: 'Align Hide UGC verify button to right side in UGC search',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.AcLogReader },
      uuid: 'c7dcbb87-172e-4845-9fd5-6afbbe09c67a',
      shortText: 'Add color highlighting and drag and drop upload.',
    },
    {
      tag: { title: [GameTitle.FH4, GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'd6c338dc-8bc7-4e1d-96a6-97063940f920',
      shortText: 'Combine Auctions and Auction Log tabs',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '1cbfd6e8-4edb-4d1a-8466-cfef7025b0b5',
      shortText: 'Allow users to add and edit cars on player inventories',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '5aa1a11f-5dce-40cc-968a-d30f02c1015a',
      shortText: 'Added skill rating and safety rating tools',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'e9168a6f-743e-4763-9dd4-204ea33136e1',
      shortText: 'Add Community Manager as a player flag option',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UnifiedCalendar },
      uuid: 'c4f99787-574d-4431-9b91-549d03abdd30',
      shortText:
        'Moved showroom calendar to unified calendar component with quality of life changes. ',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '92489393-b7da-42a0-be5b-0f006f3bdf58',
      shortText: 'Show Share Code when hovering copy button after clone UGC',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.ShowroomCalendar },
      uuid: 'e33f5cf3-a63e-4683-9c69-532e5a64b6eb',
      shortText: 'Add division and manufacturer featured showcases',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'e48f3c9e-0cf1-4991-89f8-097880da44dd',
      shortText: 'Clean up player details cards',
      longText: [
        'Move report weight and cms override buttons to top-right corner of card.',
        'Move paid entitlements into flexbox container.',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: 'e154d5c8-bdad-4170-b8f8-72dbc674d541',
      shortText: 'Player Profile tags now display Title Ids in their label',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '83c09376-b485-42d9-8337-90520a335168',
      shortText:
        'Allow overriding ban behavior to set custom duration, make ban permanent, and ban devices',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: 'c852e282-602f-4380-a618-bbede51ba8cb',
      shortText: 'Add ability to generate sharecode for UGC',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Kusto },
      uuid: '3eb1a869-5525-4f92-a56e-7a9cfe4f013d',
      shortText: 'Display results count after running Kusto query',
    },
    {
      tag: {
        title: [GameTitle.FM8],
        tool: [NavbarTool.Messaging, NavbarTool.MessageOfTheDay, NavbarTool.WelcomeCenterTiles],
      },
      uuid: '6b023f7c-9d0c-43d9-8520-fb1713bbcb31',
      shortText: 'Display active content moderation PRs to create loc string view',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'e6795959-9944-4c78-8639-9f830afd6c7f',
      shortText: 'Contact us sidebar now points to Contact Us Teams channel',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'a6b2edb4-08bb-43a9-ad75-bc3ae62d938a',
      shortText: 'Add cyids to Verify checkboxes on UGM page',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5809f4ce-6486-4ebb-8b25-ce5cb38824f3',
      shortText: 'Create shared component to view Pegasus content change PRs',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '6b023f7c-9d0c-43d9-8520-fb1713bbcb31',
      shortText: 'Allow Live Ops Admins to modify their own permissions',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'f0f3e335-a45c-45ce-92b2-514ea1acdb63',
      shortText: 'Update post requests to use existing content type in headers',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.AcLogReader },
      uuid: '154e3610-9f99-437c-9127-c3363e3e1635',
      shortText: 'Add in new Client Crash log decoder tool',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '133d4379-e2e2-4adb-9e80-70afcfa419ea',
      shortText: 'Remove configuration options from Steelhead profile reset',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UnifiedCalendar },
      uuid: '14b2aa22-2a72-4398-8bd5-f794db91b3d0',
      shortText: 'New Rivals Calendar added to Calendar component',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'f4a43980-8235-40d7-b49c-111cab0db8dc',
      shortText: 'Add character limit validation to contact us form',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: 'f28ad86e-9adb-4b51-ab52-b0e2e68035d7',
      shortText: 'Allow override of persisted UGC title and description',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: 'f68139b9-9855-4c20-9413-c98a0e0b0695',
      shortText: 'Allow credits to be added to player inventory',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'c3b3dc75-cf69-4590-8a6d-e1ae09966f93',
      shortText: 'Remove message column from auctionLog',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.ShowroomCalendar },
      uuid: 'f75bfce5-a32a-4c61-925c-9b6e24624cd3',
      shortText: 'New Showroom Calendar component',
      longText: ['Display car featured showcase and car sales in a calendar'],
    },
    {
      tag: { title: 'all', tool: NavbarTool.CarDetails },
      uuid: 'aa46faef-3d05-4ae4-92b3-f401c4c053c1',
      shortText: 'Ensure year exists everywhere a car title is shown',
    },
    {
      tag: { title: [GameTitle.FH4], tool: NavbarTool.CarDetails },
      uuid: 'da4122e0-c2e6-4f2b-9705-b06d04f6f8a7',
      shortText: 'Fix car names missing in auction log',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CarDetails },
      uuid: 'd0c7ed47-5e88-4de8-be8b-d691d38644d8',
      shortText: 'Fix not being able to load Car Details after loading it once',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Gifting },
      uuid: '112d828e-2d37-4c76-bcfd-f5ef45619e35',
      shortText: 'Add livery gifting for Steelhead',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Messaging },
      uuid: 'b831d4f8-7321-496e-a5d5-165886940756',
      shortText: 'Allow selection of localized string for message title',
    },
    {
      tag: ChangelogTag.General,
      uuid: '6b040c41-8d91-44d0-b24e-347dd7dd3327',
      shortText: 'Replace all old confirm checkboxes with V2 confirm',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '3341b310-081c-4363-8696-8f18d95f4db8',
      shortText: 'Display Title ID as tooltip in player profile chip',
      longText: [
        'For each Title ID a xuid has played on, there will be an active profile',
        'for that Title ID. Profiles are now sorted with most recently logged in',
        'as the first profile, and then all active profiles following.',
      ],
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '9cea5390-12ef-4eb4-9f87-beedd5b09db3',
      shortText: 'Remove T10Id lookup from player details',
    },
    {
      tag: ChangelogTag.General,
      uuid: '33bfbd2a-83c6-4fa5-b4ad-8dc723454e2f',
      shortText: 'Implement handling for capitalizing acronyms and apply it to changelog tags',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'f59e984b-e171-443f-9679-a2359c0b0a3f',
      shortText: 'Update Steelhead LSP nuget',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserGroupManagement },
      uuid: 'c286609b-718b-4d70-a8c8-70501b8b3c15',
      shortText: 'Display number of duplicates when adding/removing users to user groups',
    },
    {
      tag: { title: [GameTitle.Forum], tool: NavbarTool.UserBanning },
      uuid: 'cf8b1612-9c51-496e-9687-b9b86336d3f7',
      shortText: 'Fix forum banning',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: 'caff6395-2f19-4080-bbd9-58b9e6390883',
      shortText: 'Tune blob can now be downloaded',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '370da96a-bce2-4159-a6c6-d4348f8d8842',
      shortText: 'Convert player profile selection component to use composition',
    },
    {
      tag: ChangelogTag.General,
      uuid: '0fbcfd56-f8bb-4e8e-9f29-5f1d54a56b30',
      shortText: 'New Contact Us component',
    },
    {
      tag: ChangelogTag.General,
      uuid: '3d2b3e80-7804-48cf-a444-5fcbc875ad24',
      shortText: 'Removed hasAccess param from navbar component',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Gifting },
      uuid: '8d1e6edc-8506-440e-9652-c886a4a387b3',
      shortText: 'Utilize live-steward CMS slot to pull in next series content',
    },
    {
      tag: {
        title: [GameTitle.FM8],
        tool: [
          NavbarTool.UnifiedCalendar,
          NavbarTool.RacersCup,
          NavbarTool.BuildersCupCalendar,
          NavbarTool.WelcomeCenterCalendar,
        ],
      },
      uuid: '5fa53d45-178a-477c-a327-2650fb309569',
      shortText: 'Combine Steelhead calendars into single tabbed view',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: 'f5b00f0d-835b-45e7-ac51-aefd916b96a1',
      shortText: 'Improve error message when non-xuid is entered in xuid search field',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'de3a997a-31d3-426e-ac40-663a0a0fc0da',
      shortText: 'Allow UGC to be featured without an end date',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '302f1349-eb3b-421c-971d-c52d84d3985d',
      shortText: 'Add Load All button for credit history in player details deep dive',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'e3702108-3edd-4f7c-9b56-9440c3b78a68',
      shortText: 'Add year to displayed car info',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '6070292d-ff07-4d31-b72a-f0f0e2c98330',
      shortText: 'Rework verification checkbox into an icon button',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'a3150781-c8a1-4415-9379-d4f09cee9701',
      shortText: 'Convert player inventory component to use composition',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'a34b9712-384e-4e93-aff6-d0a9760adf4a',
      shortText: 'Fix sync state component for cypress tests',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '06533eea-f7b6-4dc4-99f9-dc52934452e1',
      shortText: 'Fix team lead permission error',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: 'f8e3de26-fa91-4f56-8aff-faab4843bce1',
      shortText: 'Fix leaderboard scores',
      longText: [
        'Adjusted speed traps and speed zones to be treated as meters per second.',
        'Miles per hour conversion updated to match adjustement.',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '5949f9c4-e40b-4f13-9c4f-7c1f657e4400',
      shortText: "Added 'Breaching NDA' ban reason",
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserBanning },
      uuid: '26bcd504-40bb-4045-be76-00c9f6d0872e',
      shortText: 'Update Ban Reasons',
    },
    {
      tag: {
        title: GameTitle.FM8,
        tool: [NavbarTool.UserDetails, NavbarTool.UgcDetails, NavbarTool.SearchUGC],
      },
      uuid: '013ffc89-5427-4454-b894-5bb1ca38ce28',
      shortText: 'Update Tunes to use new type Tune Blob',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterCalendar },
      uuid: 'db3ccf92-a236-4132-9597-a2f8bf91fe52',
      shortText: "Welcome Center tiles now appear on calendar only while they're active",
    },
    {
      tag: { title: [GameTitle.FH5], tool: [NavbarTool.ServicesTableStorage] },
      uuid: 'eddbd7a1-5db5-4853-95b6-531bb7780539',
      shortText: 'Added Services Table Storage view for FH5',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'd7e55959-8d9c-4295-a32c-23f3b1de9485',
      shortText: 'Remove all v1 auth functionality',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserBanning },
      uuid: 'b977e558-41d7-4c73-890b-9b55837844ef',
      shortText: 'Display player next ban duration',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserBanning },
      uuid: 'b977e558-41d7-4c73-890b-9b55837844ef',
      shortText: 'Display player next ban duration',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserBanning },
      uuid: '55c578c6-55e9-4d21-98ae-7117d9255597',
      shortText: 'New way of banning implemented',
      longText: ['Ban reason will decide the ban configuration and areas automatically'],
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.ServicesTableStorage] },
      uuid: 'd243963e-dab1-466f-99b3-f8d9b643866d',
      shortText: 'Filter out entries for unselected external profile ID',
    },
    {
      tag: { title: [GameTitle.FM8], tool: [NavbarTool.Messaging, NavbarTool.WelcomeCenterTiles] },
      uuid: 'bf98f050-9392-43e1-a9bb-b6f9acbd3e21',
      shortText: 'Hook up localized string creation form to new backing APIs',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'c1652439-efa9-4332-ba11-59e6d3ec3cd3',
      shortText: 'Clean up test bed modules after each unit test file',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: '58670a58-ff9c-4d5f-a985-bbabb955c5b4',
      shortText: 'Show reporting state for UGC as humanized string in UGC overview',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: 'f382179c-2d6c-469b-93b7-94c3cbb2b015',
      shortText: 'Add display condition field',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '863574f3-2026-4477-9e75-0e4ecfae5cb2',
      shortText: 'Add timer field',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '99394a85-7ac3-40af-a23d-e7367fedb39f',
      shortText: 'Change DeepLink category to manufacturer',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '4b58bd90-c77e-493b-ba65-0ee94ec259db',
      shortText: 'Standard tab and card formatting',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.ServicesTableStorage },
      uuid: 'f899d7f1-85c0-4a5e-affe-d34f5b3e24ce',
      shortText: 'Add Services Table Storage component',
    },
  ],
};
