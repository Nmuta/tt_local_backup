import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_Q4: ChangelogGroup = {
  title: '2022 Q4',
  id: 'cd4c3f29-ea08-4550-aec2-de051686419a',
  entries: [
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '8a79ef32-f77d-4362-8ac3-c736af5778d9',
      shortText: 'Add support FH5 Layer Groups in UGC Details tool',
      longText: [
        'Add support for Layer Groups in UGC Details tool. There is another field for "Curation Method" which is not yet exposed.',
        'Port all UGC Details endpoints to V2 Steward API.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '2293a2ab-8ff2-4b09-81d8-3a287419e65a',
      shortText: 'Setup auth V2 attributes on all Steward actions',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'a2e99456-2cd6-42f2-b70b-32fdcf7b2abb',
      shortText: 'Temporarily fix FM gifting and messaging loc bug',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '6e921f07-8574-4030-b0a0-963eb8da1dd6',
      shortText: 'Move permissions management file to be stored in mem cache',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.MessageOfTheDay },
      uuid: '9a17ad61-1e81-4ba7-b623-e8784148a68a',
      shortText: 'Display pull request URL on submit and various visual improvements',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'd5121718-586d-4cfd-a9ef-4655af2486da',
      shortText: 'Remove use of verify action button component',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5131843c-5103-47b0-b97d-7003a5df08ef',
      shortText: 'Refactor localized string dropdown',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '806b74b4-6cfa-43dc-84af-51bbf95bd53c',
      shortText: 'Remove Geneva middleware and IFX sinks',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.SearchUGC },
      uuid: 'edfd620a-eb33-4c53-adf7-8f36759462f1',
      shortText: 'Player selection filter no longer overlaps other UGC filters',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: 'd32a2e5f-fe11-47d8-bd0f-720ca1658d0b',
      shortText:
        'Backing out of UGC selection no longer traps user in redirect loop back to the selection',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5a0eb482-9e44-45b5-ac57-fa296e859257',
      shortText: 'Add support for new V2 user role',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '0e5d6089-d380-4278-997c-408115f5e5f8',
      shortText: 'Integrate auth v2',
    },
    {
      tag: {
        title: [GameTitle.FH4, GameTitle.FM7, GameTitle.FM8],
        tool: NavbarTool.UserGroupManagement,
      },
      uuid: '90b568a4-5b61-443d-947c-ce7b59141c83',
      shortText: 'Enable all titles in production',
    },
    {
      tag: {
        title: [GameTitle.FH4, GameTitle.FM7, GameTitle.FM8],
        tool: NavbarTool.UserGroupManagement,
      },
      uuid: 'f6cfbe14-052e-4901-b698-0a9782fad681',
      shortText: 'Implement failed users response and sending large amount of users',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '86423c69-64cb-4467-97fd-752183fdd74d',
      shortText: 'New button to gift livery in UGC table',
      longText: [
        'Clicking the new "Gift Livery" link will redirect the user to the gifting tool with the livery pre-loaded.',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: 'd6730fcb-e145-4a4d-a11f-011363103587',
      shortText: 'Special Xuid 1 can now be used with limited feature access',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'ccd8f14b-1c53-4906-9e4d-745894f77cf7',
      shortText: 'Fix localized string dropdown validation',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'c9d7076c-9c12-40d1-a1d5-d5e842752e10',
      shortText: 'Add tile search filters to home page',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.RacersCup },
      uuid: '9a17ad61-1e81-4ba7-b623-e8784148a68a',
      shortText: 'Add and modify color-coding in Racers Cup',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.MessageOfTheDay },
      uuid: 'd8e91341-536a-480f-b975-1d0c99138a2a',
      shortText: 'Add new tool to manage Messages of the Day',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5953bc34-2791-4a66-a9f4-9caf219efa10',
      shortText: 'Add admin-only dev tool for testing',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '4fe92558-72c7-4471-a2c6-5d3a8469267a',
      shortText: 'Cleanup naming conventions',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'c9f754d0-1344-4636-bc29-a5cc804d62c6',
      shortText: 'Create Welcome Center Calendar UI, more coming soon',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Gifting },
      uuid: '179ef494-cac6-47af-b9d9-e7695ed699df',
      shortText: 'Give Media Team permission to localized Pegasus strings',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UserGroupManagement },
      uuid: '71de15af-da30-4e1e-b05f-9eeaf4de9645',
      shortText: 'Implement failed users response and sending large amount of users',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Gifting },
      uuid: '517383d9-b9b6-44b2-90ef-27c18779a696',
      shortText: 'Update group gifting to not support cars until LSP is ready',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'e5e35c39-f035-42d9-a711-2e75abea3982',
      shortText: 'Add stricter typings to BasicPlayer',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '50034e5f-d905-4dd3-ab6e-ae16d3a3fcfd',
      shortText: 'Display license plate information',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: 'be990d01-585d-45d5-9388-7ead5aad9a99',
      shortText: 'Improve visibility of leaderboard Top Users lines',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.UserGroupManagement] },
      uuid: 'cd7ae37e-c709-4f68-9644-e11588dd58a1',
      shortText: 'Implement new bulk operation for add/remove users',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.UgcDetails, NavbarTool.SearchUGC] },
      uuid: '0a83662d-e001-4d5a-9307-69cb10295b47',
      shortText: 'Add Community Challenge UGC type to UGC details and UGC search',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserDetails },
      uuid: '2e847b23-bc1d-4b1b-8b72-765146235af0',
      shortText: 'Modify layout of FH5 user details to place smaller tools across the top',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5, GameTitle.FH4], tool: [NavbarTool.UgcDetails] },
      uuid: '898997d1-c8fb-41c0-b435-2f889b3e340b',
      shortText: 'Modify layout of UGC actions in UGC Details view',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.UserGroupManagement] },
      uuid: '045eb771-8e03-4326-a142-5ae24796c21a',
      shortText: 'Add UI restrictions to modifying All Users and Vip User groups',
    },
    {
      tag: { title: GameTitle.FH5, tool: [NavbarTool.Gifting] },
      uuid: 'c50e721e-c102-4db1-bb7e-53341f50fa8f',
      shortText: 'Fix gifting liveries issue',
    },
    {
      tag: { title: 'all', tool: [NavbarTool.SearchUGC, NavbarTool.UserDetails] },
      uuid: '54e6d5e6-0acc-4196-961d-68c37bf2b2b0',
      shortText: 'Remove hide and feature buttons in UGC table',
      longText: [
        'The removed features can still be found in UGC details, and a tooltip was added explaining that.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '63d0d2b1-78a3-4685-8399-dd96264f5758',
      shortText: 'Adjust homepage tile styling',
      longText: [
        'Correctly scroll text on deselected homepage tiles behind the title + actions sections.',
        'Additionally, makes the color transition smoothly between selected/deselected and dark/light mode.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: 'cf3a716d-7272-4951-b15c-57d842d9b375',
      shortText: 'Increase minimum size of tiles on home page',
      longText: [
        'Previous minimum size was 15rem. New minimum size is 18rem.',
        'At 1080p, this means we go from 7-tiles horizontally to 6-tiles horizontally, allowing a bit more space for tools descriptions.',
      ],
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.Messaging },
      uuid: '0503a2c8-69cf-4c26-955d-d8bd3e3f8a62',
      shortText: 'Enabled Steelhead messaging in production',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.Messaging },
      uuid: '69000317-a117-4e05-b94a-fe055e292a7e',
      shortText: 'Add localized message editing',
    },
    {
      tag: ChangelogTag.General,
      uuid: '5e25ef5c-e537-4fe3-bd50-5f8fc8a7a5f5',
      shortText: 'Add Current Endpoints navbar widget',
      longText: [
        'The Current Endpoints widget allows viewing and adjusting your current endpoint settings in the navbar.',
        'Includes a toggle for Forza Motorsport and Forza Horizon 5, one-click-switch to Retail and Studio, and a summary grid of the currently active endpoints.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '28aa6c7c-d26c-4a4c-b667-80f768ce24a5',
      shortText: 'Open Studio endpoints for all user roles',
      longText: [
        'To change your environment, click on the settings cogwheel in the top right-hand corner of the Steward app.',
        'Next, click the dropdown of the title you would like to change and select your new environment.',
        'Steward will force reload the webpage after selection.',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.CarDetails },
      uuid: 'b3c3079b-43d9-491f-a757-546df2507daa',
      shortText: 'Add new tool to view full car details',
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.UgcDetails },
      uuid: '738427c1-f87a-40d9-8534-fc0f716aca36',
      shortText: 'Add report button',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserGroupManagement },
      uuid: '10cc76cf-5aae-434c-bc5f-fbe3ddb9209b',
      shortText: 'No longer load users from large user groups',
      longText: [
        'The restricted groups are "All Users", "VIP" and "ULTIMATE_VIP".',
        'These groups are very large and trying to get their users would take too long.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '87e2f72e-87a2-42e0-8519-b73aaeb87179',
      shortText: 'Add helper functions to get tool route',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: '898e0712-5212-4d3b-9c97-e043617df293',
      shortText: 'Allow assist toggling to support both on & off selections',
      longText: [
        'You can now toggle through 3 different filter options for each assist type.',
        'Ignore - Shows scores with assist turned on or off.',
        'On - Shows scores with assist turned on.',
        'Off - Shows scores with assist turned off.',
      ],
    },
    {
      tag: { title: [GameTitle.FM8], tool: NavbarTool.Gifting },
      uuid: 'e7fe305c-5e79-4f92-990d-92e4be5ef5d5',
      shortText: 'Allow gifting up to 500 players',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '0f0fa8ff-ddaf-474d-8548-292155b160ce',
      shortText: 'Display CMS information in user details',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: '39a2eee0-fb44-4034-8743-32fb47798535',
      shortText: 'Display first and last login information in user details',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '21cfcc58-6336-4147-b267-e994a7092e06',
      shortText: 'Add new report button to ugc details',
      longText: [
        'Any Ugc can be reported with a mandatory reason coming from a dropdown.',
        'Reporting a Ugc will send it to Salus for the T10 Enforcement team to review.',
      ],
    },
    {
      tag: {
        title: 'all',
        tool: [NavbarTool.UserDetails, NavbarTool.SearchUGC, NavbarTool.Gifting],
      },
      uuid: '87a7f39a-783c-458b-b92c-186f96cd38d9',
      shortText: 'Grant various roles access to tools and features',
      longText: [
        'Grant player flag and report weight permissions to CommunityManager role',
        'Grant ban expiry and deletion permissions to SupportAgent role',
        'Grant UGC Search permissions to MediaTeam role',
      ],
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.UgcDetails },
      uuid: '1a0d8f00-e291-4e7c-b9a6-e5ca4d274285',
      shortText: 'Allow modification of Geo Flags on UGC',
      longText: [
        'Note that Geo Flags are cached for 5 minutes on a rolling basis. The cache time resets every time the UGC is viewed.',
        "As such, the Geo Flag configuration won't update immediately in the UI, and instead you may need to wait to view it.",
        'We have a request in with Services to make an uncached, Steward-only version of the data source.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: 'b1857a74-0302-4248-8e30-60c199066d32',
      shortText: 'Adjust changelog popout',
      longText: [
        'Adjusting a few older changelog entries for brevity; moving the details into expando text.',
        'Repositioning the chips to the right, condensing some contents and adding explanatory tooltips.',
        'Apply limited color-coding to the chips, emphasizing General entries, and de-emphasizing Internal entries.',
        'Fix expand-all + collapse-all feature to not "expand" entries with no expando content.',
        'Adjust padding for clarity.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'ed73707c-d956-45ff-b94e-72dc92613a7b',
      shortText: 'Add new typescript linter rules for Input and Output',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.Messaging },
      uuid: '5d7bad3d-5f99-4f6f-a77f-c08d579c75d3',
      shortText: 'Add localized message creation and sending',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Gifting },
      uuid: '47a3b05e-8d58-4f6d-a757-c8ea481612ac',
      shortText: 'Add expiration date field for gifting',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserGroupManagement },
      uuid: '0db8d052-9ff4-435d-8e3c-5a0c6990eeec',
      shortText: 'Show error for players that failed to be added or removed',
    },
    {
      tag: { title: [GameTitle.FH5], tool: NavbarTool.Leaderboards },
      uuid: '61b0d6c8-269e-49e3-b208-b4bcbfe746cf',
      shortText: 'Display and filter assists on leaderboard scores',
    },
    {
      tag: ChangelogTag.General,
      uuid: '4070e253-05fc-4758-a39a-37521e5fb103',
      shortText: 'Unlock FM tooling in production',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.SearchUGC },
      uuid: '46a55e0d-8b53-4414-b65c-b16ba44bf3cd',
      shortText: 'Revert private UGC quick link button',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FM8], tool: NavbarTool.UserDetails },
      uuid: 'feb2c9f8-0bf4-486a-9c9a-e29d5a070da0',
      shortText: 'Unlock Content Creator user flag',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5de789a1-0a15-4054-a619-18a1ca3b672e',
      shortText: 'Change bulk gift livery component to composition',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'd0db08a7-b27b-489f-8e6f-86323c8c27f4',
      shortText: 'Add tag and tool details to each changelog entry',
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.UgcDetails },
      uuid: '279c7f32-2de6-442b-909a-abc4b48aa8ab',
      shortText: 'Add Hide UGC button to UGC details',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.UserGroupManagement },
      uuid: '9470551b-e557-4004-9bf2-edf4a40d7752',
      shortText: 'Moved the Delete All Users button to top of table',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Gifting },
      uuid: '96eaa5d4-2b10-4466-94fb-b185f2fcdf29',
      shortText: 'Enable new bulk livery gifting UI for FH5',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Gifting },
      uuid: '65b068ce-13a9-42cb-ac73-1ef72dd7a10d',
      shortText: 'Implement bulk livery gifting UI',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '459b4469-89ee-4e9d-8358-e4063e3141c1',
      shortText: 'Refactor messaging component contracts',
      longText: ['Contracts validate at build time instead of runtime'],
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '39b09b8c-79fd-4439-af6c-947d8e8523c3',
      shortText: 'Allow Motorsport Designers to load, save, and reset player profiles',
      longText: ['FM navbar link is still hidden in production until full feature set is ready'],
    },
    {
      tag: { title: 'all', tool: NavbarTool.Gifting },
      uuid: '6d30fe62-505c-43c7-b660-86fd2db51ab0',
      shortText: 'Fix gifting results view to only show errors on players that failed',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5], tool: NavbarTool.UserDetails },
      uuid: '0b85cf8d-a9e9-40c1-a791-6499e9e95dcd',
      shortText: 'Temporarily disable content creator user flag until Services is ready',
    },
    {
      tag: { title: [GameTitle.FM8, GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.Messaging },
      uuid: 'c17418be-38f2-4f73-812e-f04ced9e8eab',
      shortText: 'Added message scheduling to Woodstock and Steelhead',
      longText: ['Updated Sunrise messaging UI to match, but behavior unchanged'],
    },
    {
      tag: { title: [GameTitle.FH5, GameTitle.FH4], tool: NavbarTool.Messaging },
      uuid: '8a120147-e5bc-4003-981a-dbf723a2f399',
      shortText: 'Fix bug preventing message deletion',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Gifting },
      uuid: '2b7a9b68-9150-4604-ba16-c4b175d40320',
      shortText: 'Allow gifting certain time-limited liveries as part of inventory restoration',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: 'd210cafb-3cba-4576-b68a-50459d1458d2',
      shortText: 'Move FM nav link to the left of FH5 nav link',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserDetails },
      uuid: '61f988c3-a46e-42b4-ae01-8ad3d3f52251',
      shortText: 'Verify player consent for loading and resetting profiles',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '15966959-5aaf-46e5-9f2b-ff8f82a59964',
      shortText: 'Move Steelhead master inventory to read from Pegasus data',
    },
    {
      tag: { title: 'all', tool: NavbarTool.UserDetails },
      uuid: 'a3cc9f01-7672-4bcf-ba1b-ef99f378b618',
      shortText: 'Move is under review flag to bottom of user flags',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '6bd5c0bf-b728-485c-821b-196da94fd6b7',
      shortText: 'Unify render delay. Further standardizing handling of common code scenarios',
      longText: [
        'All delay(0) and delay(1) instances have been replaced with renderDelay().',
        'This makes their purpose as "delay until between frames" operations clearer.',
      ],
    },
    {
      tag: ChangelogTag.Internal,
      uuid: 'bd7d85cf-f67c-4801-ae72-437ff09421d3',
      shortText: 'New inline copy-to-clipboard-icon. Further standardizing layout of chips',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.AuctionDetails },
      uuid: 'bd822683-a00f-429d-ac1f-48ecd1ef21f7',
      shortText: 'Display Car Name in addition to Car ID',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'eff26cfc-a21e-4df2-88f5-ace70b1a3251',
      shortText: 'Change navbar Steelhead references to FM',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'c0e47696-63fa-450f-aec3-3d4b8055ea01',
      shortText: 'Add link to FH5 Ban History PowerBi',
    },
    {
      tag: { title: GameTitle.FM8, tool: NavbarTool.UserGroupManagement },
      uuid: 'af6409e4-f04f-49e2-8069-c0842c2eb97d',
      shortText: 'Complete implementation of User Group UI for Steelhead',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '2dd8d695-2544-4408-b872-13ed1178f59b',
      shortText: 'Implement steelhead user group API',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'f0e7c22d-b662-447a-8c2f-dba92ab21981',
      shortText: 'Reduce breakage frequency of player picker chip when navigating between pages',
      longText: [
        'When navigating to a URL you were previously viewing a user on, pages will now repopulate the URL with appropriate query parameters instead of entering an unusable state.',
      ],
    },
    {
      tag: ChangelogTag.General,
      uuid: '17a5b991-0f11-419f-8c35-1e45ef5d6624',
      shortText: 'Fix issues with navbar re-ordering',
    },
    {
      tag: { title: GameTitle.FH4, tool: NavbarTool.UserGroupManagement },
      uuid: '087e36ae-f823-430d-b4db-93e4d696b666',
      shortText: 'Complete implementation of User Group UI for FH4',
    },
    {
      tag: ChangelogTag.General,
      uuid: 'f06a890a-f745-4591-8084-ab40a1307d9f',
      shortText: 'Fix text centering on home page and other misc centered-content pates',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserDetails },
      uuid: 'f1346f2f-52c0-4bc5-81f2-dffd98a2eb42',
      shortText: 'Fix bug with ban history displaying duplicate entries',
    },
    {
      tag: { title: GameTitle.FH5, tool: NavbarTool.Leaderboards },
      uuid: '943b2a39-8d00-430a-aa36-c1dbb2c7e57e',
      shortText: 'Add help popover for linking to talented user group management',
    },
    {
      tag: { title: GameTitle.FM7, tool: NavbarTool.UserGroupManagement },
      uuid: 'acb15139-69ba-4a53-a86a-b6c5ec5e7ed5',
      shortText: 'Complete implementation of User Group UI for FM7',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '852e7967-4915-488a-9e94-c2c1b34c0848',
      shortText: 'Adjust code linting rules',
    },
    {
      tag: ChangelogTag.General,
      uuid: '312b70bd-8fab-4d38-8cd8-6415a5bba3ea',
      shortText: 'Fix help popover overlay not dissapearing after route change',
    },
    {
      tag: { title: 'all', tool: NavbarTool.SearchUGC },
      uuid: '45bc12fc-5a04-4e7f-9720-b76be5cc9243',
      shortText: 'Add help popover for searching private UGC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '19bedbe0-dbc5-4e10-afa6-bd34784c1e95',
      shortText: 'Fix luxon interceptor to read in dates as UTC',
    },
    {
      tag: ChangelogTag.Internal,
      uuid: '5415ade4-074b-443d-8323-105ec29e90e6',
      shortText: 'Flipping changelog to Q4',
    },
  ],
};
