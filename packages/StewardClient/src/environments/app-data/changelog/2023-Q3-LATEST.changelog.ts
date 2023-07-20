import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q3: ChangelogGroup = {
  title: '2023 Q3',
  id: 'd519bdc3-1704-4d33-a637-3cb7a5929522',
  entries: [
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
