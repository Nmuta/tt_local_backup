import { clearInputs } from './page';

export function verifyNoInputsTest(): void {
  it('should not be able to send gift without any inputs', () => {
    clearInputs();
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

export function verifyNoGiftReasonTest(currencyName: string = 'Credits'): void {
  it('should not be able to send a gift without a gift reason', () => {
    clearInputs();
    // Setup valid gift
    cy.contains('mat-form-field', 'Search for an item').find('input').click().type(currencyName);
    cy.contains('mat-option', currencyName).click();
    cy.contains('mat-form-field', 'Quantity').click().type('1');
    cy.contains('button', 'Add Item').click();
    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

export function verifyValidGiftTest(currencyName: string = 'Credits'): void {
  it('should be able to send a gift with proper inputs', () => {
    clearInputs();
    // Setup valid gift
    cy.contains('mat-form-field', 'Search for an item').find('input').click().type(currencyName);
    cy.contains('mat-option', currencyName).click();
    cy.contains('mat-form-field', 'Quantity').click().type('1');
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
