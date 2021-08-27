import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { searchByGtag, selectLspGroup, searchByXuid, selectSunrise, verifyChip } from './page';
import { jordan } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { DateTime } from 'luxon';

context('Steward / Support / Messaging / Sunrise', () => {
  beforeEach(() => {
    login();
    disableFakeApi();
  });

  context('GTAG Lookup', () => {
    beforeEach(() => {
      searchByGtag(jordan.gtag);
      selectSunrise();
    });

    verifyChip(jordan.gtag);
    verifyNoInputsTest();
    verifyInvalidDateInputTest();
    verifyInvalidMessageInputTest();
    verifyValidInputsTest();
    verifyMessageSent();
  });

  context('XUID Lookup', () => {
    beforeEach(() => {
      searchByXuid(jordan.xuid);
      selectSunrise();
    });

    verifyChip(jordan.xuid);
    verifyNoInputsTest();
    verifyInvalidDateInputTest();
    verifyInvalidMessageInputTest();
    verifyValidInputsTest();
    verifyMessageSent();
  });

  context('GroupId Lookup', () => {
    beforeEach(() => {
      selectLspGroup('Live Ops Developers');
      selectSunrise();
    });

    verifyNoInputsTest();
    verifyInvalidDateInputTest();
    verifyInvalidMessageInputTest();
    verifyValidInputsTest();
    verifyMessageSent();
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

  it('should be reviewable with proper inputs', () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Expiry Time (mm/dd/yyyy)').click().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).should(
      'not.have.class',
      'mat-button-disabled',
    );
  });
}

function verifyInvalidDateInputTest(): void {
  it('should not be reviewable with invalid date input', () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Expiry Time (mm/dd/yyyy)').click().type('1/1/2001');
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyInvalidMessageInputTest(): void {
  const longString = new Array(600).join('f');
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should not be reviewable with invalid message input', () => {
    cy.contains('mat-form-field', 'Community Message').click().type(longString);
    cy.contains('mat-form-field', 'Expiry Time (mm/dd/yyyy)').click().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyMessageSent(): void {
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should send with proper inputs', () => {
    cy.contains('mat-form-field', 'Community Message').click().type('This is a test string.');
    cy.contains('mat-form-field', 'Expiry Time (mm/dd/yyyy)').click().type(expiryString);
    cy.contains('button', 'Review', { matchCase: false }).click();
    cy.contains('button', 'Send Message', { matchCase: false }).click();
    waitForProgressSpinners();
    cy.contains('button', 'Send Another Message', { matchCase: false }).should('exist');
  });
}
