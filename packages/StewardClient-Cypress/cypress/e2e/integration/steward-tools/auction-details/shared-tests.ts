import { searchByAuctionID } from './page';

/** Verifies that some valid auction ID will return relevant information */
// TODO: Does this need to check more information? Currently confirms it at least contains the correct ID.
export function verifyAuctionInformation(auctionId: string): void {
  it('should have the correct auction details for a valid auction', () => {
    searchByAuctionID(auctionId);
    cy.get('json-dump').should('not.exist');
    cy.contains('mat-card', 'Auction State').within(() => {
      cy.get('model-dump-simple-table').contains(auctionId);
    });
  });
}

/** Verifies that an invalid auction ID will return an error */
export function verifyInvalidAuctionSearch(): void {
  it('should have a json dump for an invalid auction', () => {
    searchByAuctionID('invalid auction id');
    cy.get('json-dump').click();
  });
}

/** Verify delete button lock functionality */
export function verifyAuctionDeleteButtonUnlock(auctionId: string): void {
  it('should enable the delete button on clicking the lock', () => {
    searchByAuctionID(auctionId);
    cy.contains('mat-card', 'Auction State').within(() => {
      cy.contains('button', 'Delete').should('be.disabled');
      cy.contains('mat-icon', 'lock_open').click();
      cy.contains('button', 'Delete').should('not.be.disabled');
    });
  });
}
