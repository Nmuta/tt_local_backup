/**
 * Verifies a given column text exists.
 * @param {string} columnName The name of the column in angular. like "featureArea"
 * @param {string} value The content to expect. like "All Requests"
 */
export function tableHasEntry(columnName: string, value: string) {
  cy.contains(`td.mat-column-${columnName}`, value).should('exist');
}
