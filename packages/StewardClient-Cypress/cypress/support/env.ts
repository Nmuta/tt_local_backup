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

const appEnvironment = Cypress.env('AAD_APP_ENV');
const appClientId = Cypress.env(`${appEnvironment}_CLIENT_ID`);
const appClientSecret = Cypress.env(`${appEnvironment}_CLIENT_SECRET`);

expect(
  appClientId,
  `${appEnvironment}_CLIENT_ID or CYPRESS_${appEnvironment}_CLIENT_ID env var must be defined. Follow instructions in .cypress.env.config`,
).to.exist;

expect(
  appClientSecret,
  `${appEnvironment}_CLIENT_SECRET or CYPRESS_${appEnvironment}_CLIENT_SECRET env var must be defined. Follow instructions in .cypress.env.config`,
).to.exist;

/** Typed environment configurations */
const env: TypedEnv = {
  tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  clientId: appClientId,
  clientSecret: appClientSecret,
  testTitle: {
    woodstock: JSON.parse(Cypress.env('TEST_WOODSTOCK') || 'false'),
    steelhead: JSON.parse(Cypress.env('TEST_STEELHEAD') || 'false'),
  },
};

export default env;
