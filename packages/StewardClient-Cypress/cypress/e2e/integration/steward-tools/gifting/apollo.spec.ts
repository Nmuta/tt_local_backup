import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { clearInputs, goToTool } from './page';
import { selectApollo } from '@support/steward/shared-functions/game-nav';
import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';
import { verifyChip } from '@support/steward/shared-functions/verify-chip';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { verifyNoInputsTest, verifyNoGiftReasonTest, verifyValidGiftTest } from './shared-tests';

context('Steward / Tools / Gifting / Apollo', () => {
  before(() => {
    login();
    disableFakeApi();
    goToTool();
    selectApollo();
    searchByGtag(RetailUsers['testing1'].gtag);
    waitForProgressSpinners();
  });

  context('GTAG Lookup', () => {
    verifyChip(RetailUsers['testing1'].gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });

  context('XUID Lookup', () => {
    before(() => {
      goToTool();
      selectApollo();
      searchByXuid(RetailUsers['testing1'].xuid);
    });
    verifyChip(RetailUsers['testing1'].xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });

  context('GroupId Lookup', () => {
    before(() => {
      goToTool();
      selectApollo();
      selectLspGroup('Live Ops Developers');
    });
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyValidGiftTest();
  });
});

function verifyTooManyCreditsTest(): void {
  it('should not be able to gift with too many credits in gift basket', () => {
    clearInputs();
    // Setup gift with too many credits
    cy.contains('mat-form-field', 'Search for an item').click().type('Credits');
    cy.contains('mat-option', 'Credits').click();
    cy.contains('mat-form-field', 'Quantity').click().type('600000000'); // 600,000,000
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

    cy.get('[mattooltip="Remove item"]').click();
  });
}
