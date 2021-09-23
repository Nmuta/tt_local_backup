/** Interface for an LSP endpoint. */
export interface LspEndpoint {
  name: string;
}

export interface LspEndpoints {
  apollo: LspEndpoint[];
  sunrise: LspEndpoint[];
  woodstock: LspEndpoint[];
  steelhead: LspEndpoint[];
}
