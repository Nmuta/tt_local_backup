export function verifyNoInputsTest(): void {
  it('should not be able to send gift without any inputs', () => {
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

export function verifyNoGiftReasonTest(): void {
  it('should not be able to send a gift without a gift reason', () => {
    // Setup valid gift
    cy.contains('mat-form-field', 'Search for an item').click().type('Credits');
    cy.contains('mat-option', 'Credits').click();
    cy.contains('button', 'Add Item').click();

    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

export function verifyValidGiftTest(): void {
  it('should be able to send a gift with proper inputs', () => {
    // Setup valid gift
    cy.contains('mat-form-field', 'Search for an item').click().type('Credits');
    cy.contains('mat-option', 'Credits').click();
    cy.contains('button', 'Add Item').click();
    // Select gift reason
    cy.contains('mat-form-field', 'Gift Reason').click();
    cy.contains('mat-option', 'Community Gift').click();
    // Send gift
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'not.have.class',
      'mat-button-disabled',
    );

    // DO NOT SEND A REAL GIFT: Can over-populate player profile and break things on LSP end.
    // Waiting till we find a way to clean up a player's profile after e2e tests are complete.
    // waitForProgressSpinners();

    // Expect
    // cy.contains('h4', 'All Gifts Sent Successfully', { matchCase: false }).should('exist');
    // cy.contains('button', 'Download results', { matchCase: false }).should('exist');
    // cy.contains('button', 'Send another gift', { matchCase: false }).should('exist');
  });
}
