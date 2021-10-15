import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, searchByXuid, verifyChip, goToTool } from './page';
import { jordan } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { verifyNoInputsTest, verifyNoGiftReasonTest, verifyValidGiftTest } from './shared-tests';
import { selectApollo } from './page';

context('Steward / Tools / Gifting / Apollo', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectApollo();
      searchByGtag(jordan.gtag);
      waitForProgressSpinners();
    });

    verifyChip(jordan.gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectApollo();
      searchByXuid(jordan.xuid);
      waitForProgressSpinners();
    });

    verifyChip(jordan.xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });
});

function verifyTooManyCreditsTest(): void {
  it('should not be able to gift with too many credits in gift basket', () => {
    // Setup gift with too many credits
    cy.contains('mat-form-field', 'Search for an item').click().type('Credits');
    cy.contains('mat-option', 'Credits').click();
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
    cy.contains('mat-error', 'Credit limit for a gift is 500,000,000.', {
      matchCase: false,
    }).should('exist');
  });
}
