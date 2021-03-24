import { GameTitleCodeName } from '@models/enums';

/** Interface for a predefined kusto query. */
export type KustoQuery = {
  name: string;
  query: string;
  title: GameTitleCodeName;
};
