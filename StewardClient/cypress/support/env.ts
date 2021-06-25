/** The typed environment variable configuration. */
export interface TypedEnv {
  /** The URI to visit before each test, passing through user authentication. */
  syncPath: string;

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
  Cypress.env('SYNC_PATH'),
  'SYNC_PATH or CYPRESS_SYNC_PATH env var must be defined. Follow instructions in .cypress.env.config',
).to.exist;

/** Typed environment configurations */
const env: TypedEnv = {
  syncPath: Cypress.env('SYNC_PATH'),
  testTitle: {
    woodstock: JSON.parse(Cypress.env('TEST_WOODSTOCK') || 'false'),
    steelhead: JSON.parse(Cypress.env('TEST_STEELHEAD') || 'false'),
  },
};

export default env;
