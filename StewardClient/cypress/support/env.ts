/** The typed environment variable configuration. */
export interface TypedEnv {
  /** The AAD tenant id. */
  tenantId: string;

  /** The AAD client app id. */
  clientId: string;

  /** The client secret to generate a valid access token. */
  clientSecret: string;

  /**
   * Which optional titles to test.
   * @deprecated It is currently not possible to test against PROD/PROD-STAGING due to SRI issues with Cypress+Angular.
   */
  testTitle: {
    /** When true, assertions on woodstock should be run. */
    woodstock: boolean;

    /** When true, assertions on steelhead should be run. */
    steelhead: boolean;
  };
}

expect(
  Cypress.env('CLIENT_ID'),
  'CLIENT_ID or CYPRESS_CLIENT_ID env var must be defined. Follow instructions in .cypress.env.config',
).to.exist;

expect(
  Cypress.env('CLIENT_SECRET'),
  'CLIENT_SECRET or CYPRESS_CLIENT_SECRET env var must be defined. Follow instructions in .cypress.env.config',
).to.exist;

/** Typed environment configurations */
const env: TypedEnv = {
  tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  clientId: Cypress.env('CLIENT_ID'),
  clientSecret: Cypress.env('CLIENT_SECRET'),
  testTitle: {
    woodstock: JSON.parse(Cypress.env('TEST_WOODSTOCK') || 'false'),
    steelhead: JSON.parse(Cypress.env('TEST_STEELHEAD') || 'false'),
  },
};

export default env;
