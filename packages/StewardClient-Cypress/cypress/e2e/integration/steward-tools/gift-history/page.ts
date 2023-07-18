import { stewardUrls } from '@support/steward/urls';

/** Performs a search by gtag and waits for the search to complete. */
export function goToTool(): void {
  cy.visit(stewardUrls.tools.giftHistory.default);
}
