import { stewardUrls } from '@support/steward/urls';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Performs a search by gtag and waits for the search to complete. */
export function goToTool(): void {
  cy.visit(stewardUrls.tools.auctionDetails.default);
}

/** Finds and fills in Auction ID field */
export function searchByAuctionID(auctionId: string): void {
  cy.contains('mat-form-field', 'Auction ID', { matchCase: false }).type(
    `{selectAll}{backspace}${auctionId}\n`,
  );
  waitForProgressSpinners();
}
