import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { goToTool } from './page';
import { selectSunrise } from '@support/steward/shared-functions/game-nav';
import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';
import { verifyChip } from '@support/steward/shared-functions/verify-chip';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { verifyNoInputsTest, verifyNoGiftReasonTest, verifyValidGiftTest } from './shared-tests';
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / Gifting / Sunrise', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
      searchByGtag(RetailUsers['jordan'].gtag);
      waitForProgressSpinners();
    });

    verifyChip(RetailUsers['jordan'].gtag);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
      searchByXuid(RetailUsers['jordan'].xuid);
      waitForProgressSpinners();
    });

    verifyChip(RetailUsers['jordan'].xuid);
    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });

  context('GroupId Lookup', () => {
    beforeEach(() => {
      goToTool();
      selectSunrise();
      selectLspGroup('Live Ops Developers');
    });

    verifyNoInputsTest();
    verifyNoGiftReasonTest();
    verifyTooManyCreditsTest();
    verifyTooManyWheelSpinsTest();
    verifyTooManySuperWheelSpinsTest();
    verifyValidGiftTest();
  });
});

function verifyTooManyCreditsTest(): void {
  it('should not be able to gift with too many credits in gift basket', withTags(Tag.Broken), () => {
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

function verifyTooManyWheelSpinsTest(): void {
  it('should not be able to gift with too many wheel spins in gift basket', withTags(Tag.Broken), () => {
    // Setup gift with too many credits
    cy.contains('mat-form-field', 'Search for an item').click().type('WheelSpins');
    cy.contains('mat-option', 'WheelSpins').click();
    cy.contains('mat-form-field', 'Quantity').click().clear().type('201');
    cy.contains('button', 'Add Item').click();
    // Select gift reason
    cy.contains('mat-form-field', 'Gift Reason').click();
    cy.contains('mat-option', 'Community Gift').click();

    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.contains('mat-error', 'Wheel Spin limit for a gift is 200.', { matchCase: false }).should(
      'exist',
    );
  });
}

function verifyTooManySuperWheelSpinsTest(): void {
  it('should not be able to gift with too many super wheel spins in gift basket', withTags(Tag.Broken), () => {
    // Setup gift with too many credits
    cy.contains('mat-form-field', 'Search for an item').click().type('SuperWheelSpins');
    cy.contains('mat-option', 'SuperWheelSpins').click();
    cy.contains('mat-form-field', 'Quantity').click().clear().type('201');
    cy.contains('button', 'Add Item').click();
    // Select gift reason
    cy.contains('mat-form-field', 'Gift Reason').click();
    cy.contains('mat-option', 'Community Gift').click();

    // Expect
    cy.contains('button', 'Send Gift', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
    cy.contains('mat-error', 'Wheel Spin limit for a gift is 200.', { matchCase: false }).should(
      'exist',
    );
  });
}
