import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_Q2_Q3: ChangelogGroup = {
  title: '2022 Q2 - Q3',
  id: '8d8286fe-2fd7-421a-bae8-607212cac0e2',
  entries: [
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionDetails },
      uuid: 'bd822683-a00f-429d-ac1f-48ecd1ef21f7',
      shortText: 'Display Car Name in addition to Car ID',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: '91b5cae4-d232-40dd-8b65-689a09541524',
      shortText: 'Add leaderboard talent gridlines to graph view',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '3ba37c6d-ddce-4504-953c-e51105af7b7d',
      shortText: 'Add placeholder preview image to Hidden UGC without a preview',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '884b4929-f0ec-4817-920a-2b89228cca4b',
      shortText: 'Add border around UGC preview images in player details',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Gifting },
      uuid: '6379f0d9-8d16-418a-b037-04b5f325371a',
      shortText: 'Adjust Gifting tool layout. Standardizing header button layout',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '3974e3cb-558a-4c88-96f7-143c52d39275',
      shortText: 'Restructuring changelog data to make it easier to cut for Q4',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Gifting },
      uuid: '6e1b24d6-3549-4ae9-9255-231bf8da191b',
      shortText: 'Standardizing form layout',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserGroupManagement },
      uuid: 'a0715fb8-2af7-4b21-9a57-5897e0197e6d',
      shortText: 'Implement User Group API endpoints',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'f71bde48-8c48-4cff-a5c5-cce381d18717',
      shortText: 'Wire up Steelhead V2 services and UI for user report weight',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'f811bc8e-5679-4a85-a7fd-21c2be63b94a',
      shortText: 'Wire up Steelhead V2 services and UI for player flags',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '231ae6ea-5f6d-45a3-a030-38477e9d7c09',
      shortText: 'Wire up Steelhead V2 services and UI for user banning and ban history',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '328d3279-097c-494f-be96-af50f15b233e',
      shortText:
        'Wire up Steelhead V2 services and UI for console banning and shared console users',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.RacersCup },
      uuid: 'f3d99f82-f538-47e6-b0ef-054174e10ce8',
      shortText: 'Improve Racers Cup filtering performance',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '9d8f363f-45b4-4ff5-a901-3dc029f5429b',
      shortText: 'Remove identity hint on inline player selection',
    },
    {
      tag: {
        title: 'all',
        tool: [NavbarTool.UserBanning, NavbarTool.Messaging, NavbarTool.Gifting],
      },
      uuid: '66db4d20-33fa-4301-8a35-479b5304f2d3',
      shortText: 'Remove unnecessary scrollbar in player selection component',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '4828148f-e5d8-4085-a85d-3b1fa4412917',
      shortText: 'Update list of Steward devs for contact us',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserDetails },
      uuid: 'a78cc115-4b08-4a30-b9ef-360811ae8da0',
      shortText: 'Add report weight tooling to player details',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.Leaderboards] },
      uuid: '950d4cd0-87a2-4de7-9fc0-5756b40922c0',
      shortText: 'Fix bug in Leaderboard jump to score functionality',
    },
    {
      tag: {
        title: 'all',
        tool: [NavbarTool.UgcDetails],
      },
      uuid: 'f9a3ee9c-d4a8-4d53-99e8-bec9e1c5f3a4',
      shortText: 'Do not display base64 C-Livery data in UGC Details',
    },
    {
      tag: { title: GameTitle.FH4, tool: [NavbarTool.UserDetails] },
      uuid: 'df898ffc-b96a-4cc5-8037-5ad4afe7bf2e',
      shortText: 'Add user save rollback information to FH4',
    },
    {
      tag: ChangelogTag.General,
      uuid: '4b5ed37b-835e-49ef-9bae-68e780f124d1',
      shortText: 'All external tools now auto-open in new tab',
    },
    {
      tag: {
        title: [GameTitle.FM8],
        tool: [
          NavbarTool.AdminSteelheadDev,
          NavbarTool.AdminSteelheadStudio,
          NavbarTool.AdminFH4Studio,
          NavbarTool.AdminFM7Studio,
        ],
      },
      uuid: '77922281-d545-46a4-9fbd-1067523b84b1',
      shortText: 'Add external tool links for steelhead dev and steelhead, fh4, and fm7 studio',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserGroupManagement] },
      uuid: '2cea2732-f195-49bc-b0df-35e2beb95167',
      shortText: 'Integrate User Group management for FH5',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.UserDetails, NavbarTool.UgcDetails] },
      uuid: 'afa9f358-4401-45e3-a435-b934732be6aa',
      shortText: 'Allow Horizon and Motorsport desginers to access Player Details',
    },
    {
      tag: { title: GameTitle.FM8, tool: [NavbarTool.RacersCup] },
      uuid: '0d060b5d-bb53-4aa8-aae5-316371ab022b',
      shortText: 'Fix bug in Racers Cup slot selection',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '8c41df65-98ee-4420-9f0a-dd2cd96c9d8d',
      shortText: 'Fix IIS to support 32k URLs',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.UserDetails, NavbarTool.UgcDetails] },
      uuid: '08cb5d2f-3c13-4ba8-96e7-4b03b5067e2d',
      shortText: 'Add download c livery option to UGC items',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserDetails] },
      uuid: 'eb80c3e9-09eb-4013-897b-3cc7c708014f',
      shortText: 'Added Loyalty Rewards to new Loyalty tab',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserDetails] },
      uuid: 'fdc7dc23-224b-45aa-abf1-4ffbb71437a4',
      shortText: 'Entitlements have been moved to new Loyalty tab',
    },
    {
      tag: ChangelogTag.General,
      uuid: '3b1f8729-6415-4db8-b15f-7974d2408fc9',
      shortText: 'Add query params to single and multi player selection',
    },
    {
      tag: { title: 'all', tool: NavbarTool.Gifting },
      uuid: 'a1768c67-ca16-4448-a762-3f41497353c6',
      shortText: 'Add support agent admin role to list users allowed to gift liveries',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '4798cdbb-16da-45ed-8242-1f4282391cb6',
      shortText: 'Design UI for user group management',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserDetails, NavbarTool.UgcDetails] },
      uuid: 'bcfe4514-f698-467b-8247-68f812af0dc7',
      shortText: 'Add searching and featuring event blueprints to FH5',
    },
    {
      tag: {
        title: GameTitle.FH5,
        tool: NavbarTool.SearchUGC,
      },
      uuid: 'e864a69f-a4b8-44f2-b31c-987c0a32eca2',
      shortText: 'Add featured only filter to public UGC search filters',
    },
    {
      tag: {
        title: GameTitle.FH5,
        tool: NavbarTool.SearchUGC,
      },
      uuid: 'a7ad5c58-9b1f-422b-848c-25813ce352db',
      shortText: 'Add player lookup to UGC search filters',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '15cfea84-ba33-45e3-aec3-39d3d3fe68cd',
      shortText: 'Add new wrapper for loading component',
    },
    {
      tag: ChangelogTag.General,
      uuid: '4b68c770-fc42-4534-a777-33896d6d5d0f',
      shortText: 'Correct phrasing on splash page',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UserDetails, NavbarTool.SearchUGC] },
      uuid: '00e879e0-bc91-454f-9b12-6b890b0eb491',
      shortText: 'Fix contrast issue with Featured UGC highlight background',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UgcDetails },
      uuid: 'b1d0ed01-bfe9-48e2-883a-a9095489b399',
      shortText: 'Fix bug in featuring UGC',
    },
    {
      tag: {
        title: GameTitle.FH5,
        tool: NavbarTool.SearchUGC,
      },
      uuid: 'd45c930b-a051-419c-a63a-7298f8630f6c',
      shortText: 'Add "Download Top 500" button to UGC search results for Photo thumbnails',
    },
    {
      tag: {
        title: 'all',
        tool: [NavbarTool.UgcDetails],
      },
      uuid: '358d6b5f-c769-4c5c-ab0e-89764c839a82',
      shortText: 'Fix date not showing when selecting a UGC feature date',
    },
    {
      tag: {
        title: [GameTitle.FH5, GameTitle.FH4],
        tool: [NavbarTool.UserDetails, NavbarTool.SearchUGC],
      },
      uuid: 'd45c930b-a051-419c-a63a-7298f8630f6c',
      shortText: 'Add Download button for individual photo results in UGC views',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.SearchUGC },
      uuid: 'ba7f6127-81d8-4dd4-b816-6c35f92c80fe',
      shortText: 'Update deprecated UGC tool to Search UGC tool',
    },
    {
      tag: ChangelogTag.General,
      uuid: '199c3e9a-a129-44bd-ad84-62b3b125b112',
      shortText:
        'Add new tile linking to PowerBi dashboard showing data on user actions in Steward',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'd1e13ab2-1cff-4dda-969b-95c08838e454',
      shortText: 'Add refresh button on login if user has no role',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.Gifting },
      uuid: '1a46fb61-979a-4c37-aad1-d1fa94f5d321',
      shortText: 'Add ability to gift liveries in FM7',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserDetails },
      uuid: '70580359-449d-4e37-9cc2-0b0116712957',
      shortText: 'Hide UGC feature button on FM7',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: 'f50ebd7f-7d07-4e37-8347-654e618bc046',
      shortText: 'Add end row to credit history',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserDetails },
      uuid: '886c66fb-7125-4659-adb6-b1dd7428724f',
      shortText: 'Add Livery UGC search to FM7',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionDetails },
      uuid: '8f098685-43d4-4ee0-9dec-135cfd5f3250',
      shortText: 'Allow all auctions to be deleted',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'f2ccc26a-4c48-4d07-8c4f-cc842584f38e',
      shortText: 'Fixed bug in Leaderboard environment selection',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UgcDetails },
      uuid: '09a4ae82-f65f-4d8d-945b-124f004b5cf5',
      shortText: 'Bug fix for UGC lookup by sharecode',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserDetails },
      uuid: 'e42964d9-2637-480d-a4ac-ce798a3c9ab8',
      shortText: 'Fix UGC player search not pulling in private content',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'ceaa380c-de3d-4a95-b880-7699d090d3d4',
      shortText: 'Modify file structure for UGC views',
    },
    {
      tag: ChangelogTag.General,
      uuid: '829603f4-1411-441d-8123-3a3694a1b514',
      shortText: 'Fix color contrast issues in ban duration selector and notifications count icon',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: 'a6047488-182f-4b0d-93f4-4c85c5c9d127',
      shortText: 'Add UGC feature button to UGC details',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'e58afaac-e7c0-4194-a7a1-0c789cf858db',
      shortText: 'Add environment selection to Leaderboard lookup',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'd6d47959-e01d-48fe-bedd-a2845ade2941',
      shortText: 'Add export functionality to Leaderboard scores',
    },
    {
      tag: ChangelogTag.General,
      uuid: '5a8d7afa-e87f-4d99-b8af-342134bb09fe',
      shortText: 'Link XUIDs to their player details page',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: '5c7fbae0-affa-4954-9546-7009b1e7a9e4',
      shortText: 'Link UGC search to UGC details',
    },
    {
      tag: ChangelogTag.General,
      uuid: '1e13a1b0-44dc-48e8-8d97-9a8438f69cbf',
      shortText: 'Add new MediaTeam role',
      longText: [`MediaTeam role has read-only access to all data within the player details tool`],
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
        'Changelog is now configured to automatically show changes by area and batch',
        'A number of changelogs may be "active" at a time, and older changelogs are considered "inactive"',
        'Among the active changelogs, each area can be acknowledged or ignored, as well as all areas or individual changelog entries',
      ],
    },
  ],
};
