import BigNumber from 'bignumber.js';
/** Interface for an lsp group. */
export interface LspGroup {
  id: BigNumber;
  name: string;
}

/** Type for lsp groups. */
export type LspGroups = LspGroup[];
