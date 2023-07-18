import { GameTitleCodeName } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';

/** Interface for a predefined kusto query. */
export type KustoQuery = {
  id: GuidLikeString;
  name: string;
  query: string;
  title: GameTitleCodeName;
};
