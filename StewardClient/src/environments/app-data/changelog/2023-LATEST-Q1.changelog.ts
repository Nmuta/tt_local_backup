import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q1: ChangelogGroup = {
  title: '2023 Q1',
  id: '056f7a46-ee96-4dbf-a689-f3edbef2c34d',
  entries: [
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
