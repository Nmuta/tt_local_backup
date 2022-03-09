import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid, selectGravity, verifyChip, goToTool } from './page';
import { jordan } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { verifyNoInputsTest, verifyNoGiftReasonTest, verifyValidGiftTest } from './shared-tests';

context('Steward / Tools / Gifting / Gravity', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectGravity();
      searchByGtag(jordan.gtag);
      waitForProgressSpinners();
    });

    verifyChip(jordan.gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest('SOFT CURRENCY');
    verifyTooManySoftCurrencyTest();
    verifyTooManyHardCurrencyTest();
    verifyValidGiftTest('SOFT CURRENCY');
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectGravity();
      searchByXuid(jordan.xuid);
      waitForProgressSpinners();
    });

    verifyChip(jordan.xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest('SOFT CURRENCY');
    verifyTooManySoftCurrencyTest();
    verifyTooManyHardCurrencyTest();
    verifyValidGiftTest('SOFT CURRENCY');
  });
});

function verifyTooManySoftCurrencyTest(): void {
  it('should not be able to gift with too much soft currency in gift basket', () => {
    // Setup gift with too much soft currency
    cy.contains('mat-form-field', 'Search for an item').click().type('SOFT CURRENCY');
    cy.contains('mat-option', 'SOFT CURRENCY').click();
    cy.contains('mat-form-field', 'Quantity').click().clear().type('600000000'); // 600,000,000
    cy.contains('button', 'Add Item').click();
    // Select gift reason
    cy.contains('mat-form-field', 'Gift Reason').click();
    cy.contains('mat-option', 'Community Gift').click();

    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.contains('mat-error', 'Soft Currency limit for a gift is 500,000,000.', {
      matchCase: false,
    }).should('exist');
  });
}

function verifyTooManyHardCurrencyTest(): void {
  it('should not be able to gift with too much hard currency in gift basket', () => {
    // Setup gift with too much soft currency
    cy.contains('mat-form-field', 'Search for an item').click().type('HARD CURRENCY');
    cy.contains('mat-option', 'HARD CURRENCY').click();
    cy.contains('mat-form-field', 'Quantity').click().clear().type('600000000'); // 600,000,000
    cy.contains('button', 'Add Item').click();
    // Select gift reason
    cy.contains('mat-form-field', 'Gift Reason').click();
    cy.contains('mat-option', 'Community Gift').click();

    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.contains('mat-error', 'Hard Currency limit for a gift is 15,000.', {
      matchCase: false,
    }).should('exist');
  });
}
