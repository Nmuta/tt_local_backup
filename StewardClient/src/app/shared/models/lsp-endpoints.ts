/** Interface for an LSP endpoint. */
export interface LspEndpoint {
  name: string;
}

/** API Response model bundling LSP Endpoint keys. */
export interface LspEndpoints {
  apollo: LspEndpoint[];
  sunrise: LspEndpoint[];
  woodstock: LspEndpoint[];
  steelhead: LspEndpoint[];
}

/** Navbar "default" endpoint. For displaying warnings. */
export const RetailEndpoint = 'Retail';

/** Per-title default endpoints. For retrieving "live" summaries. */
export const LspDefaultEndpoints: { [key in keyof LspEndpoints]: string } = {
  apollo: RetailEndpoint,
  sunrise: RetailEndpoint,
  woodstock: RetailEndpoint,
  steelhead: RetailEndpoint,
};
