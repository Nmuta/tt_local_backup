import { GameTitle } from '@models/enums';
import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2023_Q1: ChangelogGroup = {
  title: '2023 Q1',
  id: '056f7a46-ee96-4dbf-a689-f3edbef2c34d',
  entries: [
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
