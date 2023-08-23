import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';
import { selectWoodstock } from '@support/steward/shared-functions/game-nav';
import { verifyChip } from '@support/steward/shared-functions/verify-chip';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { DateTime } from 'luxon';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

context('Steward / Tools / Messaging / Woodstock', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    before(() => {
      searchByGtag(RetailUsers['luke'].gtag);
      verifyChip(RetailUsers['luke'].gtag);
    });

    context('Default State Checks', () => {
      verifyNoInputsTest();
    });

    context('Valid Inputs Checks', () => {
      verifyValidInputsTest();
      verifyMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidMessageInputTest();
    });
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(RetailUsers['luke'].xuid);
      verifyChip(RetailUsers['luke'].xuid);
    });

    context('Default State Checks', () => {
      verifyNoInputsTest();
    });

    context('Valid Inputs Checks', () => {
      verifyValidInputsTest();
      verifyMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidMessageInputTest();
    });
  });

  context('GroupId Lookup', () => {
    before(() => {
      selectLspGroup('Live Ops Developers');
    });

    context('Default State Checks', () => {
      verifyNoInputsTest();
    });

    context('Valid Inputs Checks', () => {
      verifyValidInputsTest();
      verifyMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidMessageInputTest();
    });
  });
});

function verifyNoInputsTest(): void {
  it('should not be reviewable without any inputs', () => {
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyValidInputsTest(): void {
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should be reviewable with proper inputs', withTags(Tag.Broken), () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Date Range').click().clear().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).should(
      'not.have.class',
      'mat-button-disabled',
    );
  });
}

function verifyInvalidDateInputTest(): void {
  it('should not be reviewable with invalid date input', withTags(Tag.Broken), () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Date Range').click().clear().type('1/1/2001');
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyInvalidMessageInputTest(): void {
  const longString = new Array(600).join('f');
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should not be reviewable with invalid message input', withTags(Tag.Broken), () => {
    cy.contains('mat-form-field', 'Community Message').click().type(longString);
    cy.contains('mat-form-field', 'Date Range').click().clear().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyMessageSent(): void {
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should send with proper inputs', withTags(Tag.Broken), () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Date Range').click().clear().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).click();
    cy.contains('button', 'Send Message', { matchCase: false }).click();
    waitForProgressSpinners();
    cy.contains('button', 'Send Another Message', { matchCase: false }).should('exist');
  });
}
