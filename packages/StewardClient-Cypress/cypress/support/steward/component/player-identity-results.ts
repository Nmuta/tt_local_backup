/**
 * Player identity results to verify.
 * False for "none". Empty-string for "exists/any". Undefined for "no check".
 */
export interface PlayerIdentityResults {
  /** The gamertag. False for "none". Empty-string for "exists/any". Undefined for "no check". */
  gtag: string | false;

  /** The XUID. False for "none". Empty-string for "exists/any". Undefined for "no check". */
  xuid: string | false;

  /** The T10 ID. False for "none". Empty-string for "exists/any". Undefined for "no check". */
  t10Id: string | false;
}

/**
 * Verifies that the current context contains a player identity result with the given values.
 * False for "none". Empty-string for "exists/any". Undefined for "no check".
 */
export function verifyPlayerIdentityResults(options: PlayerIdentityResults): void {
  verifyIdentifier('.t10-gtag', options.gtag);
  verifyIdentifier('.t10-xuid', options.xuid);
  verifyIdentifier('.t10-t10id', options.t10Id);
}

/** Verifies a single identifier. */
function verifyIdentifier(iconSelector: string, expectedIdentifier: string | false) {
  if (Cypress._.isString(expectedIdentifier)) {
    const $icon = cy.get(iconSelector).should('exist');
    const $identifier = $icon.parent().get('.identifier');
    $identifier.should('contain', expectedIdentifier);
  } else if (expectedIdentifier === false) {
    cy.get(iconSelector).should('not.exist');
  }
}
