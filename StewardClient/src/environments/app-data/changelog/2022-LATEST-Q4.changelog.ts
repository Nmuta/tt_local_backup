import { NavbarTool } from '../tool-list';
import { ChangelogGroup, ChangelogTag } from './types';

/** User-facing changes to the code. */
export const CHANGELOG_2022_Q4: ChangelogGroup = {
  title: '2022 Q4',
  id: 'cd4c3f29-ea08-4550-aec2-de051686419a',
  entries: [
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
