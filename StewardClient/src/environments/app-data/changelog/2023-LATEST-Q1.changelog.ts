import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q1: ChangelogGroup = {
  title: '2023 Q1',
  id: '056f7a46-ee96-4dbf-a689-f3edbef2c34d',
  entries: [
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
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UgcDetails, NavbarTool.UserDetails] },
      uuid: 'b9023154-10fd-4cae-ba81-410c19a1a34b',
      shortText: 'Add layer group and event blueprint as supported UGC types',
    },
    {
      tag: { title: 'all', tool: NavbarTool.PermissionManagement },
      uuid: '1c3c4bf8-86dc-4cbf-afc9-3863c83b2dfc',
      shortText: 'Give admins override access to all users and permissions',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Gifting },
      uuid: '3b1f2834-b5d0-451c-ba48-46f4b50749d0',
      shortText: 'Allow items in next content release to be giftable',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserDetails, NavbarTool.SearchUGC] },
      uuid: '420e8b5e-a281-4fe9-8505-5d15723a17aa',
      shortText: 'Display Layer Group thumbnails',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '28550227-cded-4111-b099-a28f3cd5b6b2',
      shortText: 'Fix UGC overflow styling',
    },
    {
      tag: { title: 'all', tool: NavbarTool.PermissionManagement },
      uuid: 'f6b0f4cf-be12-47bd-b5f2-a75105fb9631',
      shortText: 'Allow team leads to manage their team members',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '7bb8390b-2fdb-4a25-830b-ca9155b45cae',
      shortText: 'Fix issue with Woodstock loyalty rewards and some cleanup',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '3379a529-4720-4972-946d-c457e5f87432',
      shortText: 'Persist UGC popup now includes icon to open persisted item in a new tab',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '22386364-e53a-424f-a12d-9ad7d38dd5e0',
      shortText: 'Update Woodstock loyalty rewards to look like Steelhead loyalty rewards.',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '4f2446fd-fd88-47f1-93c2-3ea350cca8f1',
      shortText: 'Persist UGC success popup now allows the user to copy new ugc id',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: 'a962db50-cf71-4cae-8d42-87ce32fe5063',
      shortText: 'Add Loyalty tab with Loyalty Rewards tool',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '21d83616-5d2f-4d74-95a4-27273bbbaa74',
      shortText: 'Fully incorportate Forum as a game title with stubbed environment',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Home },
      uuid: '96adf13c-80b2-4406-8a81-ea1af0fc8e81',
      shortText: 'General updates to home page',
      longText: [
        'Fix filtering on disabled tools.',
        'Add MOTD to to GeneralUser for visibility and update restrictions.',
        'Add Welcome Center Tiles to GeneralUser for visibility and update restrictions.',
        'Add restrictions to Create Auction.',
        'Add restrictions to Banning.',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CarDetails },
      uuid: '8d7d1ddd-9881-4134-8f67-4a5386ba2e0c',
      shortText: 'Add additional properties',
      longText: [
        'Add properties including: powertrain name, region name, car class name,',
        'car type name, performance index, series, and release date.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '044af69b-02c5-42cb-8834-776b3e418007',
      shortText: 'Recipient updates to contact us forms',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '8832d741-8529-4316-881c-ccc2dbff141f',
      shortText: 'Implement UI for Driver Level/Prestige Rank in Player Details',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.UserBanning, NavbarTool.UserDetails] },
      uuid: '4b5b61e5-baa1-4430-97e0-e05ea9f89e2b',
      shortText: 'Add ability to record forum ban',
      longText: [
        'Forum ban are saved in Steward for reference and do not actually ban users on forums.',
        'History of forum ban can be seen on the General tab of Player Details',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '8d7d1ddd-9881-4134-8f67-4a5386ba2e0c',
      shortText: 'Fix persisting UGC content',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: 'a17731bc-0dc1-402b-a7b3-82f5e78dbe5a',
      shortText: 'Fix tool styling to match other game titles',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '7dcff416-9146-4f98-a6ee-fe8381f418c5',
      shortText: 'Added ability to grant a user paid entitlements',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'cb5b78a6-4021-42ea-b7b6-80ede3e97326',
      shortText: 'Remove special characters from gamertag lookup on paste or when manually typed',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserBanning },
      uuid: '7880276c-1f28-4927-8f80-7fbc92acf04a',
      shortText: 'Show error when valid ban reason is not selected',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'd4f293ab-d3ae-4b1f-b1f9-d95e0e1c0e41',
      shortText: 'Display team information in profile & contact us messages',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'b9020fef-2d19-4e8e-8b5c-6fbc3e87f709',
      shortText: 'Stop player selection re-lookup when removing player',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '29d3b079-5e0f-48a7-8062-9f6398b878ba',
      shortText: 'Update gameTitle to be humanized throughout front-end',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '947b953a-d168-432b-a743-9e449ba30441',
      shortText: 'Searching now includes both featured and non-featured UGC content',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '5ac93e91-e6c3-46fa-a0e7-117fc6720930',
      shortText: "Add ability to remove a player's cms override",
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'e498e3b6-b949-11ed-afa1-0242ac120002',
      shortText: 'Remove whitespace from strings in search box on UGC Details',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '91cdf725-4d0d-45cc-9d26-520e86e2a113',
      shortText: 'Rename mat tree node functions to remove boilerplate todo prefix',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '6ca4b560-726c-4d07-b313-01946c666460',
      shortText: 'Add sandbox selection to profile load tool',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '2b2a95a2-d759-40f9-9a0d-ec9509d4b20b',
      shortText: 'Update to latest Steelhead Forzaclient nuget',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.BuildersCupCalendar },
      uuid: '88fcfa1c-96e6-4d18-bd75-5428aed9ec5c91',
      shortText: 'Add series event windows, car restrictions, and filtering',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '69abd636-ffb4-4400-ada0-3819fff430d4',
      shortText: 'Add ability to delete Steward teams',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'c74997cf-d6d3-40a6-bde6-8c0e5f710387',
      shortText: 'Add new admin tool to manage Steward teams',
    },
    {
      tag: {
        title: [GameTitle.FH4, GameTitle.FH5, GameTitle.FM7, GameTitle.FM8],
        tool: NavbarTool.UserBanning,
      },
      uuid: '7eb2d58b-4dca-4811-a4b4-62eed1894be9',
      shortText: 'Update list of ban reasons',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '28348e1d-a311-4f49-be39-9e7663898d5a',
      shortText: 'Update contact us dev list',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CreateAuction },
      uuid: 'f27c15dc-f9de-4667-b4b8-859f7a13a643',
      shortText: 'Fix permission error',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: '65ac43da-bbe4-4936-aca8-c7752f5844c4',
      shortText: 'Readd back in old auctions tab',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: 'ab4ed9dc-47f4-4c27-91d8-e8ef57fe046e',
      shortText: 'Fix leaderboard bugs',
      longText: [
        'Talented users are now loading if endpoint is set to Studio',
        'Device types displaying properly on page load',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '6d2cf0a5-e77c-4326-adde-94f7f3900491',
      shortText: 'Move permission management user list out to its own component',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.RacersCup },
      uuid: '895a09a4-87a3-4158-8ef5-dd5784daa728d',
      shortText: 'Add car restrictions to event details view',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UserDetails },
      uuid: '97733f8ab-7e8b-4b39-a1a3-b88693efeb83',
      shortText: 'Modify player UGC keyword filter to match regardless of casing',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: 'ce8f3f39-9cf5-4aa0-82fd-d64b4c082b29',
      shortText: 'Persist and Clone UGC success popup stays on-screen until dismissed',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UserDetails },
      uuid: '7b106529-7c3e-49be-b09c-072fe1e6be67',
      shortText: 'Remove old auctions tab in favor of auction logs tab',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.WelcomeCenterTiles },
      uuid: '4166c37e-344e-44a9-b4cc-7b82bd5d3f61',
      shortText: 'Added support for Generic Popup and Deeplink tiles',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'd92f49d2-3518-49d6-b5f9-b894f994c2e4',
      shortText: 'Homepage available actions filter only loads for General User role',
      longText: [
        'Some users are still using the old permission role system.',
        "Since they don't have the new permissions there's no value in loading the filter on startup.",
      ],
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '11b4301b-756a-4015-a7c1-7ca817741dde',
      shortText: 'Add ability to override a player cms.',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'e692ef6b-2eab-4a24-827b-c09e9442142c',
      shortText: 'Homepage now filters by user write permissions on load',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '56699ccd-33be-4f7f-8834-45eb7a71c23d',
      shortText: 'Split Vip and Ultimate Vip flags by device',
      longText: [
        'Vip and Ultimate Vip now are separate based on device types.',
        'The supported device types are Steam and Xbox/Windows.',
      ],
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.PlayFab },
      uuid: 'a0954464-0bb3-456b-9629-9e995ff4e861',
      shortText: 'New PlayFab build management tool',
      longText: [
        'In the tool, you are able to lock and unlock PlayFab builds from being deleted.',
        'Additionally, users with valid permissions have the ability to change the max number of available build locks.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: 'fad320f0-f724-4b46-8e60-b6cfc39b87f5',
      shortText: 'Update endpoint selection to ignore invalid titles for users',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: '01016f44-2d05-4cfb-9133-f1f8cd16c303',
      shortText: 'Add ability to search for Xuid 1',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'd5758b93-a447-4ced-8a5b-6406828c64fc',
      shortText: 'Fix Navbar colors while in Edit Mode',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'cd9aa261-4e82-4b8d-8181-22a120c28e82',
      shortText: 'Initial MVP effort for new PlayFab build management tool',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '6e026fe0-9624-402f-a7f8-c992c76748e5',
      shortText: 'Add TypeScript typings around change detection',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '8daf979f-0f6d-4228-bd79-650b64e29686',
      shortText: 'Merge gift livery perms into basic gift perms',
    },
    {
      tag: ChangelogTag.General,
      uuid: '611e27c6-025c-44f9-a068-bd6d534cc2e0',
      shortText: 'Restrict tools home page from users without a role',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Messaging },
      uuid: 'aa9a2be8-f513-45db-804c-43f12e05f1f5',
      shortText: 'Fix invalid permissions displaying as valid',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.BuildersCupCalendar },
      uuid: 'e84c76da-cbaa-43aa-8716-aa52079efb2a',
      shortText: "Add calendar tool that displays Builder's Cup featured Tours",
    },
    {
      tag: {
        title: [GameTitle.FH5, GameTitle.FH4],
        tool: [NavbarTool.UserDetails],
      },
      uuid: '4dd325df-5a59-43e3-be81-e98cc6a5d319',
      shortText: 'Add sort options to credit update view',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UserDetails },
      uuid: '7ff5c818-1510-4c30-b41b-15f8ef06c0e4',
      shortText: 'Give V1 auth roles access to updated credit history view',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'c50fb424-7b32-472a-8f3a-a46fea0038f8',
      shortText: 'Featuring UGC now only sets featured end date',
      longText: [
        'Force featured end date is now ignored.',
        'There is an open work item to allow for a fully configurable UGC featured status.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '92349474-466e-409d-91a9-bb1280daffd5',
      shortText: 'Fix auth refresh bug that stops permissions from loading',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'e467ed45-c3aa-4a8a-abef-2725bf7334c1',
      shortText:
        'Switch Woodstock and Sunrise credit update APIs with V2 versions that pulls directly from Kusto',
    },
    {
      tag: ChangelogTag.General,
      uuid: '7dde5027-cadc-4d90-a809-5c8dca247831',
      shortText: 'Add tool & route restrictions for auth V2',
    },
    {
      tag: {
        title: [GameTitle.FH5, GameTitle.FH4],
        tool: [NavbarTool.SearchUGC, NavbarTool.UserDetails],
      },
      uuid: 'afb89433-0165-48f8-9ecc-b7ff8cf7fa21',
      shortText: 'New button to hide multiple Ugcs added to Ugc search',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '89e244fe-d239-44fe-b6e6-8470e5beb278',
      shortText: 'Cut changelog. Updated to 2023 Q1',
    },
  ],
};
