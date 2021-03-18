import { KustoQuery } from './kusto-query';

/** Interface for all predefined kusto queries. */
export type AllKustoQueries = {
  gravity: KustoQuery[];
  sunrise: KustoQuery[];
  apollo: KustoQuery[];
  opus: KustoQuery[];
};
